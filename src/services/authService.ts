import { AdminUser } from '../types/admin';

const ADMIN_SESSION_KEY = 'gangchill_admin_session';

const DEMO_ADMIN: AdminUser = {
  id: 'adm-001',
  name: 'মোঃ কামরুল হাসান',
  email: 'admin@gangchill.com',
  role: 'superadmin',
  phone: '01712-345678',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  lastLogin: new Date().toISOString()
};

export const authService = {
  /**
   * Check if an admin is currently logged in
   */
  isAuthenticated(): boolean {
    return Boolean(this.getCurrentUser());
  },

  /**
   * Get currently logged-in admin user
   */
  getCurrentUser(): AdminUser | null {
    try {
      const data = localStorage.getItem(ADMIN_SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data) as AdminUser;
    } catch {
      return null;
    }
  },

  /**
   * Admin Login Simulation
   * In Phase 1 Frontend: Validates credentials and creates session
   */
  async login(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Demo admin credentials
    if (email.trim().toLowerCase() === 'admin@gangchill.com' && password === 'admin123') {
      const user = { ...DEMO_ADMIN, lastLogin: new Date().toISOString() };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
      return { success: true, user };
    }

    return {
      success: false,
      error: 'ইমেইল বা পাসওয়ার্ড সঠিক নয়। (ডেমো ক্রেডেনশিয়াল: admin@gangchill.com / admin123)'
    };
  },

  /**
   * Admin Logout
   */
  logout(): void {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
};
