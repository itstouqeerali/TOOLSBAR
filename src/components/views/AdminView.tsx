import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, Users, Wrench, Layers, Settings, 
  Activity, CheckCircle2, RefreshCw, Key, Database,
  Clock, ShieldAlert, ArrowUpRight, Search, ChevronLeft,
  ChevronRight, ArrowUpDown, Filter, UserCheck, UserX,
  Copy, Check, AlertTriangle, X, Shield, Lock,
  ExternalLink, Eye, ArrowRight, Server, FileText,
  Mail, Calendar, Sparkles
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, query, limit } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { UserProfile, UserRole } from '../../types/auth';
import { TOOLS } from '../../data/tools';
import { CATEGORIES } from '../../data/categories';
import firebaseConfig from '../../../firebase-applet-config.json';

type AdminTab = 'overview' | 'users' | 'tools' | 'categories' | 'security';
type SortField = 'createdAt' | 'lastLoginAt' | 'email' | 'displayName';
type SortOrder = 'desc' | 'asc';

const SUPER_ADMIN_EMAIL = 'kingtouqeerali@gmail.com';

interface AdminViewProps {
  onNavigate: (path: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const { user: currentUser, userProfile: currentAdminProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // Data state
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // User table state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Selected User Detail Modal
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Role Action Confirmation Modal
  const [roleModalUser, setRoleModalUser] = useState<UserProfile | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole>('user');
  const [roleUpdating, setRoleUpdating] = useState<boolean>(false);
  const [roleActionError, setRoleActionError] = useState<string | null>(null);
  const [roleActionSuccess, setRoleActionSuccess] = useState<string | null>(null);

  // Tools search filter state in Tools tab
  const [toolSearch, setToolSearch] = useState<string>('');
  const [toolCategoryFilter, setToolCategoryFilter] = useState<string>('all');

  // Fetch users from Firestore
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setFetchError(null);
    try {
      // Safe bounded query loading up to 250 users
      const q = query(collection(db, 'users'), limit(250));
      const snap = await getDocs(q);
      const docs: UserProfile[] = [];
      snap.forEach((docSnap) => {
        docs.push(docSnap.data() as UserProfile);
      });
      setUsersList(docs);
    } catch (err: any) {
      console.error('Admin user fetch error:', err);
      setFetchError(err?.message || 'Failed to fetch user directory from Firestore.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Copy helper
  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handle Role Change Execution
  const executeRoleChange = async () => {
    if (!roleModalUser) return;
    setRoleActionError(null);
    setRoleActionSuccess(null);

    // Safeguard 1: Prevent changing Super Admin
    if (roleModalUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      setRoleActionError('The primary super-admin account role cannot be modified.');
      return;
    }

    // Safeguard 2: Prevent current logged in admin from demoting themselves
    if (currentUser && roleModalUser.uid === currentUser.uid && targetRole !== 'admin') {
      setRoleActionError('You cannot demote your own administrator account.');
      return;
    }

    setRoleUpdating(true);
    try {
      const nowIso = new Date().toISOString();
      const userRef = doc(db, 'users', roleModalUser.uid);
      await updateDoc(userRef, {
        role: targetRole,
        updatedAt: nowIso,
      });

      // Update local state immediately
      setUsersList((prev) =>
        prev.map((u) => (u.uid === roleModalUser.uid ? { ...u, role: targetRole, updatedAt: nowIso } : u))
      );

      if (selectedUser && selectedUser.uid === roleModalUser.uid) {
        setSelectedUser((prev) => (prev ? { ...prev, role: targetRole, updatedAt: nowIso } : null));
      }

      setRoleActionSuccess(`Successfully updated role for ${roleModalUser.email} to ${targetRole.toUpperCase()}.`);
      setTimeout(() => {
        setRoleModalUser(null);
        setRoleActionSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error('Error updating user role:', err);
      setRoleActionError(err?.message || 'Failed to update user role in Firestore.');
    } finally {
      setRoleUpdating(false);
    }
  };

  // Derived Metrics from Real Firestore Data
  const metrics = useMemo(() => {
    const totalUsers = usersList.length;
    const adminUsers = usersList.filter((u) => u.role === 'admin').length;
    const standardUsers = usersList.filter((u) => u.role === 'user').length;
    const verifiedUsers = usersList.filter((u) => u.emailVerified === true).length;
    const unverifiedUsers = usersList.filter((u) => !u.emailVerified).length;

    const recentRegistrations = [...usersList]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);

    const recentSignIns = [...usersList]
      .filter((u) => u.lastLoginAt)
      .sort((a, b) => new Date(b.lastLoginAt || 0).getTime() - new Date(a.lastLoginAt || 0).getTime())
      .slice(0, 5);

    return {
      totalUsers,
      adminUsers,
      standardUsers,
      verifiedUsers,
      unverifiedUsers,
      recentRegistrations,
      recentSignIns,
    };
  }, [usersList]);

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    let result = [...usersList];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          (u.displayName && u.displayName.toLowerCase().includes(q)) ||
          u.uid.toLowerCase().includes(q)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role === roleFilter);
    }

    // Verification filter
    if (verificationFilter === 'verified') {
      result = result.filter((u) => u.emailVerified === true);
    } else if (verificationFilter === 'unverified') {
      result = result.filter((u) => !u.emailVerified);
    }

    // Sorting
    result.sort((a, b) => {
      let valA: any = a[sortField] || '';
      let valB: any = b[sortField] || '';

      if (sortField === 'createdAt' || sortField === 'lastLoginAt') {
        const timeA = new Date(valA || 0).getTime();
        const timeB = new Date(valB || 0).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [usersList, searchQuery, roleFilter, verificationFilter, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Active and Roadmap Tool Collections
  const activeTools = useMemo(() => {
    return TOOLS.filter((t) => t.isImplemented && t.status === 'ready');
  }, []);

  const roadmapTools = useMemo(() => {
    return TOOLS.filter((t) => !t.isImplemented || t.status === 'coming-soon');
  }, []);

  // Active Categories (categories containing at least one functional tool)
  const activeCategories = useMemo(() => {
    return CATEGORIES.filter((cat) =>
      activeTools.some((t) => t.category === cat.id)
    );
  }, [activeTools]);

  // Filtered Tools for Tools Tab
  const filteredTools = useMemo(() => {
    return TOOLS.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
        t.slug.toLowerCase().includes(toolSearch.toLowerCase()) ||
        t.description.toLowerCase().includes(toolSearch.toLowerCase());
      const matchesCat = toolCategoryFilter === 'all' || t.category === toolCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [toolSearch, toolCategoryFilter]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Never / N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Never';
    try {
      const diff = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="admin-panel-container">
      {/* Top Banner / Identity Bar */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30 border border-indigo-500/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Production Admin Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
              Toolsbar System Administration
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-neutral-400">
              <span>Admin: <strong className="text-slate-900 dark:text-white font-mono">{currentUser?.email}</strong></span>
              <span>•</span>
              <span>Role: <span className="font-bold uppercase text-amber-500 font-mono">{currentAdminProfile?.role || 'admin'}</span></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Security Rules Active
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchUsers}
              disabled={loadingUsers}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
              <span>Refresh Directory</span>
            </button>
            <button
              onClick={() => onNavigate('')}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>Back to Toolsbar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'users', label: `Users (${usersList.length})`, icon: Users },
          { id: 'tools', label: `Tools Registry (${activeTools.length})`, icon: Wrench },
          { id: 'categories', label: `Categories (${activeCategories.length})`, icon: Layers },
          { id: 'security', label: 'Security & Infrastructure', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-white/10'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.05]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Global Error Banner */}
      {fetchError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{fetchError}</span>
          </div>
          <button
            onClick={fetchUsers}
            className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold cursor-pointer"
          >
            Retry Fetch
          </button>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Total Registered Users</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                {loadingUsers ? '...' : metrics.totalUsers}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-neutral-400 font-mono">
                <span>{metrics.adminUsers} Admins</span>
                <span>•</span>
                <span>{metrics.standardUsers} Standard</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Email Verification</span>
                <UserCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                {loadingUsers ? '...' : `${metrics.verifiedUsers}`}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <span>{metrics.unverifiedUsers} unverified accounts</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Public Utility Tools</span>
                <Wrench className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                {activeTools.length}
              </div>
              <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                100% Client-Side In-Browser
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Active Tool Categories</span>
                <Layers className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                {activeCategories.length}
              </div>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                Structured SEO routes
              </p>
            </div>
          </div>

          {/* Activity Feeds (Recent Registrations & Recent Sign-Ins) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Registrations Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                    Recent Registrations
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSortField('createdAt');
                    setSortOrder('desc');
                    setActiveTab('users');
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                >
                  View all →
                </button>
              </div>

              {loadingUsers ? (
                <div className="py-8 text-center text-xs text-slate-400 animate-pulse">Loading registrations...</div>
              ) : metrics.recentRegistrations.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No user accounts found.</div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                  {metrics.recentRegistrations.map((u) => (
                    <div
                      key={u.uid}
                      onClick={() => setSelectedUser(u)}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.02] rounded-xl px-2 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {u.displayName || u.email}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">{u.email}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-neutral-300'
                        }`}>
                          {u.role}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{formatRelativeTime(u.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Sign-Ins Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                    Recent Sign-Ins & Sessions
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSortField('lastLoginAt');
                    setSortOrder('desc');
                    setActiveTab('users');
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                >
                  View all →
                </button>
              </div>

              {loadingUsers ? (
                <div className="py-8 text-center text-xs text-slate-400 animate-pulse">Loading activity...</div>
              ) : metrics.recentSignIns.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No login activity recorded yet.</div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                  {metrics.recentSignIns.map((u) => (
                    <div
                      key={u.uid}
                      onClick={() => setSelectedUser(u)}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.02] rounded-xl px-2 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {u.displayName || u.email}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">{u.email}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {formatRelativeTime(u.lastLoginAt)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{formatDate(u.lastLoginAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Infrastructure Health Status Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-500" />
              <span>Firebase Services & Security State</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] space-y-1">
                <span className="text-slate-400 font-medium block">Firebase Auth Provider</span>
                <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Email & Password
                </span>
                <span className="text-[10px] text-slate-500 font-mono">browserLocalPersistence</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] space-y-1">
                <span className="text-slate-400 font-medium block">Cloud Firestore DB</span>
                <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Connected
                </span>
                <span className="text-[10px] text-slate-500 font-mono truncate block">
                  {firebaseConfig.firestoreDatabaseId || 'default'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] space-y-1">
                <span className="text-slate-400 font-medium block">Security Rules Version</span>
                <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Rules Version 2
                </span>
                <span className="text-[10px] text-slate-500">Owner Isolation + RBAC</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] space-y-1">
                <span className="text-slate-400 font-medium block">Browser Privacy</span>
                <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-500" /> 100% In-Memory
                </span>
                <span className="text-[10px] text-slate-500">Zero file upload to DB</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-6 animate-in fade-in duration-200">
          {/* Title and Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                User Management Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Viewing {filteredUsers.length} of {usersList.length} total Firestore user records
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Page Size:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search email, name, UID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins Only</option>
                <option value="user">Standard Users Only</option>
              </select>
            </div>

            {/* Verification Filter */}
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={verificationFilter}
                onChange={(e) => {
                  setVerificationFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Verifications</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => {
                  const [f, o] = e.target.value.split('-');
                  setSortField(f as SortField);
                  setSortOrder(o as SortOrder);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="createdAt-desc">Newest Registered</option>
                <option value="createdAt-asc">Oldest Registered</option>
                <option value="lastLoginAt-desc">Recently Active</option>
                <option value="email-asc">Email (A to Z)</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          {loadingUsers ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading user profiles from Firestore...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
              <UserX className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-900 dark:text-white">No matching users found</p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Try clearing or adjusting your search filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('all');
                  setVerificationFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/[0.06] text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Verified</th>
                    <th className="pb-3 font-semibold">Registered</th>
                    <th className="pb-3 font-semibold">Last Session</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                  {paginatedUsers.map((u) => {
                    const isSuper = u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
                    const isCurrent = currentUser?.uid === u.uid;

                    return (
                      <tr key={u.uid} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                              u.role === 'admin'
                                ? 'bg-gradient-to-tr from-amber-500 to-indigo-600'
                                : 'bg-gradient-to-tr from-indigo-600 to-cyan-500'
                            }`}>
                              {(u.displayName || u.email).charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                                <span>{u.displayName || 'No Name Set'}</span>
                                {isSuper && (
                                  <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase bg-indigo-500/20 text-indigo-400">
                                    Primary Super-Admin
                                  </span>
                                )}
                                {isCurrent && (
                                  <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono truncate">
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-neutral-300'
                          }`}>
                            <Shield className="w-3 h-3" />
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3.5">
                          {u.emailVerified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                              Unverified
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 text-slate-500 dark:text-neutral-400 whitespace-nowrap">
                          {formatDate(u.createdAt)}
                        </td>

                        <td className="py-3.5 text-slate-500 dark:text-neutral-400 whitespace-nowrap">
                          {formatRelativeTime(u.lastLoginAt)}
                        </td>

                        <td className="py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Detail Button */}
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/10 text-slate-700 dark:text-neutral-200 text-xs font-semibold cursor-pointer transition-colors"
                              title="View user details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Role Toggle Button */}
                            {!isSuper && !isCurrent && (
                              <button
                                onClick={() => {
                                  setRoleModalUser(u);
                                  setTargetRole(u.role === 'admin' ? 'user' : 'admin');
                                  setRoleActionError(null);
                                  setRoleActionSuccess(null);
                                }}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                                  u.role === 'admin'
                                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400'
                                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                }`}
                              >
                                {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-white/[0.06] text-xs">
              <span className="text-slate-500 dark:text-neutral-400">
                Showing {Math.min((currentPage - 1) * pageSize + 1, filteredUsers.length)} to{' '}
                {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} entries
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-900 dark:text-white px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TOOLS REGISTRY */}
      {activeTab === 'tools' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Public Tool Catalog ({activeTools.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Registered from <code className="font-mono">src/data/tools.ts</code> with local client-side engines ({activeTools.length} active ready{roadmapTools.length > 0 ? `, ${roadmapTools.length} roadmap` : ''})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Tool Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter tools..."
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  className="w-48 pl-10 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={toolCategoryFilter}
                onChange={(e) => setToolCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] space-y-3 relative group hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{t.name}</span>
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 inline-block mt-1">
                      {t.category}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    t.isImplemented && t.status === 'ready'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  }`}>
                    {t.isImplemented && t.status === 'ready' ? 'Active (Ready)' : 'Roadmap / Coming Soon'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400">/tools/{t.slug}</span>
                  {t.isImplemented ? (
                    <button
                      onClick={() => onNavigate(`tools/${t.slug}`)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Launch</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs italic">Coming Soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Active Category Registry ({activeCategories.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Structured taxonomy grouping the {activeTools.length} browser-first tools ({activeCategories.length} active categories)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const catActiveTools = activeTools.filter((t) => t.category === cat.id);
              const isRoadmapOnly = catActiveTools.length === 0;

              return (
                <div
                  key={cat.id}
                  className={`p-5 rounded-2xl border space-y-3 transition-all flex flex-col justify-between ${
                    !isRoadmapOnly
                      ? 'bg-slate-50 dark:bg-white/[0.02] border-slate-100 dark:border-white/[0.05] hover:border-indigo-500/30'
                      : 'bg-slate-50/50 dark:bg-white/[0.01] border-dashed border-slate-200 dark:border-white/10 opacity-75'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        !isRoadmapOnly
                          ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      }`}>
                        {!isRoadmapOnly ? `${catActiveTools.length} ${catActiveTools.length === 1 ? 'tool' : 'tools'}` : 'Roadmap Only'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-400">/category/{cat.slug}</span>
                    <button
                      onClick={() => onNavigate(`category/${cat.slug}`)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY & INFRASTRUCTURE */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Security Architecture & Infrastructure Specifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Hardened configuration across Authentication, Database, and Client Routing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity & RBAC Matrix Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Role-Based Access Control (RBAC)</span>
              </h4>
              <div className="space-y-2 text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04]">
                  <strong className="text-slate-900 dark:text-white">Super-Administrator:</strong>{' '}
                  <span className="font-mono text-indigo-500">{SUPER_ADMIN_EMAIL}</span> (Guaranteed Admin access in rules and code).
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04]">
                  <strong className="text-slate-900 dark:text-white">Normal Users:</strong> Registered with default role <code className="font-mono">user</code>. Prevented from mutating own role in Firestore rules.
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04]">
                  <strong className="text-slate-900 dark:text-white">Protected Route:</strong> <code className="font-mono">/admin</code> guarded by React Router + Firestore user profile validation.
                </div>
              </div>
            </div>

            {/* Cloud Firestore Security Rules Summary */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-500" />
                <span>Firestore Security Rules Specifications</span>
              </h4>
              <div className="space-y-2 text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04]">
                  <strong className="text-slate-900 dark:text-white">Owner Isolation:</strong> Normal users can only read/write their own document at <code className="font-mono">/users/{'{uid}'}</code>.
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04]">
                  <strong className="text-slate-900 dark:text-white">Admin Scoping:</strong> Full directory listing & user role promotion permitted only for authenticated admin sessions.
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04]">
                  <strong className="text-slate-900 dark:text-white">Zero Public Writes:</strong> No open/insecure rules exist.
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logging Architecture Information Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              <span>Activity & Audit Infrastructure Note</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
              In accordance with security best practices, authoritative and tamper-proof security auditing logs (such as administrative role promotions or deletion audit trails) require a trusted server-side execution environment (such as Google Cloud Functions or Firebase Admin SDK backend services). Client-side activity timestamps (<code className="font-mono">createdAt</code>, <code className="font-mono">lastLoginAt</code>, <code className="font-mono">updatedAt</code>) are captured directly on user profile documents in Firestore.
            </p>
          </div>
        </div>
      )}

      {/* MODAL 1: USER DETAIL DRAWER / MODAL */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.12] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 text-left cursor-default animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Avatar */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg ${
                selectedUser.role === 'admin'
                  ? 'bg-gradient-to-tr from-amber-500 to-indigo-600'
                  : 'bg-gradient-to-tr from-indigo-600 to-cyan-500'
              }`}>
                {(selectedUser.displayName || selectedUser.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  {selectedUser.displayName || 'No Display Name'}
                </h3>
                <span className="text-xs text-slate-400 font-mono">{selectedUser.email}</span>
              </div>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                selectedUser.role === 'admin'
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-neutral-300'
              }`}>
                Role: {selectedUser.role}
              </span>
              {selectedUser.emailVerified ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  Email Verified
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-500">
                  Unverified Email
                </span>
              )}
            </div>

            {/* Fields List */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04] flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block font-medium">User UID</span>
                  <span className="font-mono text-slate-900 dark:text-white font-semibold truncate block max-w-xs">
                    {selectedUser.uid}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(selectedUser.uid, 'uid')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
                  title="Copy UID"
                >
                  {copiedField === 'uid' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04]">
                  <span className="text-slate-400 block font-medium">Registered Date</span>
                  <span className="text-slate-900 dark:text-white font-medium block mt-1">
                    {formatDate(selectedUser.createdAt)}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04]">
                  <span className="text-slate-400 block font-medium">Last Sign-In</span>
                  <span className="text-slate-900 dark:text-white font-medium block mt-1">
                    {formatDate(selectedUser.lastLoginAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Role Modification Action */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-3">
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                Administrative Actions
              </span>

              {selectedUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">
                  This is the designated primary Super-Administrator account. Its permissions are permanent.
                </div>
              ) : currentUser?.uid === selectedUser.uid ? (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-500 text-xs">
                  You cannot modify your own administrative role from this view.
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setRoleModalUser(selectedUser);
                      setTargetRole(selectedUser.role === 'admin' ? 'user' : 'admin');
                      setRoleActionError(null);
                      setRoleActionSuccess(null);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      selectedUser.role === 'admin'
                        ? 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {selectedUser.role === 'admin' ? 'Demote to Standard User' : 'Promote to Administrator'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ROLE PROMOTION / DEMOTION CONFIRMATION */}
      {roleModalUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
          onClick={() => !roleUpdating && setRoleModalUser(null)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.12] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 text-left cursor-default animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                targetRole === 'admin' ? 'bg-amber-500/15 text-amber-500' : 'bg-red-500/15 text-red-500'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  Confirm Role Change
                </h3>
                <p className="text-xs text-slate-400">Enforced by Firestore Security Rules</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
              Are you sure you want to change the authorization role for{' '}
              <strong className="text-slate-900 dark:text-white font-mono">{roleModalUser.email}</strong> to{' '}
              <strong className={`uppercase ${targetRole === 'admin' ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
                {targetRole}
              </strong>?
            </p>

            {roleActionError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-300 text-xs">
                {roleActionError}
              </div>
            )}

            {roleActionSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{roleActionSuccess}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRoleModalUser(null)}
                disabled={roleUpdating}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeRoleChange}
                disabled={roleUpdating}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-md transition-all cursor-pointer disabled:opacity-50 ${
                  targetRole === 'admin' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                {roleUpdating ? 'Saving Changes...' : `Confirm ${targetRole === 'admin' ? 'Promotion' : 'Demotion'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
