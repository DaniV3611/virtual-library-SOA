export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  device_type?: string;
  device_name?: string;
  browser?: string;
  os?: string;
  user_agent?: string;
  ip_address?: string;
  location?: string;
  is_active: boolean;
  last_activity: string;
  login_method?: string;
  failed_attempts: number;
  is_suspicious: boolean;
  created_at: string;
  expires_at: string;
  revoked_at?: string;
  session_metadata?: string;
}

export interface UserSessionsResponse {
  sessions: UserSession[];
  total: number;
}

export interface RevokeSessionRequest {
  session_id: string;
}

export interface RevokeSessionResponse {
  message: string;
  session_id: string;
}

export interface RevokeAllSessionsResponse {
  message: string;
  revoked_count: number;
  current_session_kept: boolean;
}
