export const OWNER_AVATARS: Record<string, string> = {
  biz_apex: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', // Rajesh Kumar
  biz_horizon: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', // Priya Sharma
  biz_designcraft: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', // Vikram Mehta
  biz_ca_solutions: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', // Ananya Rao
  biz_zenith: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', // Karan Malhotra
  biz_austin_tech: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', // James Holden
  biz_austin_realty: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', // Sarah Conner
  biz_pending_applicant: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' // Dr. Suresh Reddy
};

export const getOwnerAvatar = (businessId: string): string => {
  return OWNER_AVATARS[businessId] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'; // Fallback avatar
};
