import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSCAData } from '../../context/SCADataContext';
import { Eye, MousePointerClick, Share2, Megaphone, ArrowLeft, Briefcase, Handshake, Users } from 'lucide-react';

export const BusinessFeed: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const { businesses, promotions, promotedOffers } = useSCAData();
  const [activeTab, setActiveTab] = useState<'posts' | 'promoted'>('posts');

  const business = businesses.find((b) => b.id === businessId);

  if (!business) {
    return (
      <div className="p-8 text-center text-white">
        <h2 className="text-xl font-bold">Business not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-red-500 underline">Go Back</button>
      </div>
    );
  }

  // Posts created by this business
  const businessPosts = promotions
    .filter((p) => p.businessId === businessId && p.status === 'LIVE')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Ads this business has promoted for others
  const businessPromotedAds = promotedOffers
    .filter((po) => po.promoterBusinessId === businessId)
    .map((po) => {
      // Find the original promotion to display its details
      const originalPromo = promotions.find((p) => p.id === po.promotionId);
      return { ...po, originalPromo };
    })
    .filter(po => po.originalPromo !== undefined)
    .sort((a, b) => new Date(b.datePromoted).getTime() - new Date(a.datePromoted).getTime());

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Business Header */}
        <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl p-6 flex items-center space-x-4">
          <img src={business.logo} alt={business.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-red-900" />
          <div>
            <h1 className="text-2xl font-black uppercase text-white tracking-tight">{business.name}</h1>
            <div className="text-sm text-neutral-400 mt-1">{business.categoryName}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-neutral-800">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3 px-1 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'posts' ? 'border-[#e50914] text-[#e50914]' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Their Marketing Posts
          </button>
          <button
            onClick={() => setActiveTab('promoted')}
            className={`py-3 px-1 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'promoted' ? 'border-[#e50914] text-[#e50914]' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Ads They Have Promoted
          </button>
        </div>

        {activeTab === 'posts' && (
          <div className="space-y-6">
            {businessPosts.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 border border-neutral-800 rounded-2xl">
                <Megaphone className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No active marketing posts.</p>
              </div>
            ) : (
              businessPosts.map((post) => (
                <div key={post.id} className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-4 flex items-center space-x-3">
                    <img src={post.businessLogo} alt={post.businessName} className="w-12 h-12 rounded-xl object-cover border border-neutral-700" />
                    <div>
                      <div className="text-base font-black text-white">{post.businessName}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="px-4 pb-2">
                    <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                    <p className="text-sm text-neutral-300 mb-4">{post.description}</p>
                  </div>

                  {post.imageUrl && (
                    <div className="w-full">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-96 object-cover" />
                    </div>
                  )}

                  <div className="p-4 border-t border-neutral-900 bg-[#050505]">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1.5">
                          <Eye className="w-4 h-4" />
                          <span>{post.views.toLocaleString()} Views</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MousePointerClick className="w-4 h-4" />
                          <span>{post.clicks.toLocaleString()} Clicks</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-blue-400">
                          <Users className="w-4 h-4" />
                          <span>Promoted by {post.membersPromotingCount || 0} users</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[#e50914]">
                        <Share2 className="w-4 h-4" />
                        <span>{post.shares.toLocaleString()} Shares</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'promoted' && (
          <div className="space-y-6">
            {businessPromotedAds.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 border border-neutral-800 rounded-2xl">
                <Share2 className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>They haven't promoted any ads yet.</p>
              </div>
            ) : (
              businessPromotedAds.map((po) => {
                const promo = po.originalPromo!;
                return (
                  <div key={po.id} className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl overflow-hidden shadow-lg relative">
                    {/* Badge indicating it's a share */}
                    <div className="absolute top-4 right-4 bg-red-900/80 text-white text-[10px] font-black uppercase px-2 py-1 rounded">
                      Promoted by {business.name}
                    </div>
                    
                    <div className="p-4 flex items-center space-x-3 opacity-80">
                      <Link to={`/app/feed/${promo.businessId}`}>
                        <img src={promo.businessLogo} alt={promo.businessName} className="w-10 h-10 rounded-lg object-cover border border-neutral-700 cursor-pointer hover:border-red-600 transition-colors" />
                      </Link>
                      <div>
                        <Link to={`/app/feed/${promo.businessId}`} className="text-sm font-black text-white hover:text-red-500 transition-colors">
                          {promo.businessName}
                        </Link>
                        <div className="text-[10px] text-neutral-500 mt-0.5">Original Post • {promo.categoryName}</div>
                      </div>
                    </div>

                    <div className="px-4 pb-2">
                      <h3 className="text-base font-bold text-white mb-2">{promo.title}</h3>
                      <p className="text-xs text-neutral-300 mb-4 line-clamp-3">{promo.description}</p>
                    </div>

                    {promo.imageUrl && (
                      <div className="w-full">
                        <img src={promo.imageUrl} alt={promo.title} className="w-full h-48 object-cover opacity-90" />
                      </div>
                    )}
                    
                    <div className="p-3 border-t border-neutral-900 bg-black/40 text-xs text-neutral-400">
                      Shared on: {new Date(po.datePromoted).toLocaleDateString()} via {po.channels.join(', ')}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
