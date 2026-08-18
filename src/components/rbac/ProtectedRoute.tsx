import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Permission, Role } from '../../types';
import { hasPermission, hasRole } from '../../utils/rbac';
import { PermissionDeniedState } from '../common/PermissionDeniedState';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  allowedRoles,
}) => {
  const { currentUser } = useAuth();

  // Role check
  if (allowedRoles && !hasRole(currentUser, allowedRoles)) {
    return <PermissionDeniedState requiredPermission={`Role: ${allowedRoles.join(', ')}`} />;
  }

  // Permission check
  if (requiredPermission && !hasPermission(currentUser, requiredPermission)) {
    return <PermissionDeniedState requiredPermission={requiredPermission} />;
  }

  return <>{children}</>;
};

export const PermissionGuard: React.FC<{
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ permission, children, fallback = null }) => {
  const { currentUser } = useAuth();
  if (hasPermission(currentUser, permission)) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
};
