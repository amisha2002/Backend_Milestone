/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import UserList from './components/UserManagement/UserList';
import UserForm from './components/UserManagement/UserForm';
import UserViewModal from './components/UserManagement/UserViewModal';
import UserDeleteModal from './components/UserManagement/UserDeleteModal';
import PostForm from './components/PostManagement/PostForm';
import PostViewModal from './components/PostManagement/PostViewModal';
import PostDeleteModal from './components/PostManagement/PostDeleteModal';
import PostList from './components/PostManagement/PostList';
import Login from './components/UserManagement/Login';
import { User } from './types/user';
import { Post } from './types/post'; 
import CategoryList from './components/CategoryManagement/CategoryList';
import CategoryForm from './components/CategoryManagement/CategoryForm';
import OrderList from './components/OrderManagement/OrderList';
import OrderForm from './components/OrderManagement/OrderForm';
import { Category } from './types/category';

function AppWrapper() {
  return (
    <App />
  );
}

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [viewPost, setViewPost] = useState<Post | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deletePost, setDeletePost] = useState<Post | null>(null);
  const [refreshList, setRefreshList] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const getpageAccess = (): string[] => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return [];
    try {
      const user = JSON.parse(userStr);
      return user.pageAccess || [];
    } catch {
      return [];
    }
  };

  const hasAccess = (page: string): boolean => {
    const pageAccess = getpageAccess();
    return pageAccess.includes(page);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen flex">
      
      {/* Sidebar */}
      <div className="w-72 glass-dark h-screen p-6 sticky top-0 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">🌿 DataFlow</h1>
          <p className="text-gray-300 text-sm">Management Suite</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {hasAccess('users') && (
            <button
              onClick={() => navigate('/users')}
              className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
            >
              <span className="text-xl">👥</span>
              <span className="font-medium">Users</span>
            </button>
          )}
          {hasAccess('categories') && (
            <button
              onClick={() => navigate('/categories')}
              className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
            >
              <span className="text-xl">📂</span>
              <span className="font-medium">Categories</span>
            </button>
          )}
          {hasAccess('posts') && (
            <button
              onClick={() => navigate('/posts')}
              className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
            >
              <span className="text-xl">📝</span>
              <span className="font-medium">Posts</span>
            </button>
          )}
          {hasAccess('orders') && (
            <button
              onClick={() => navigate('/orders')}
              className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
            >
              <span className="text-xl">🛒</span>
              <span className="font-medium">Orders</span>
            </button>
          )}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-all duration-300 flex items-center gap-3"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto animate-fade-in">

        {/* Modals */}
        {viewUser && <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />}
        {deleteUser && (
          <UserDeleteModal
            user={deleteUser}
            onConfirm={() => {
              setDeleteUser(null);
              setRefreshList(true);
            }}
            onCancel={() => setDeleteUser(null)}
            refreshList={refreshList}
            setRefreshList={setRefreshList}
          />
        )}
        {viewPost && <PostViewModal post={viewPost} onClose={() => setViewPost(null)} />}
        {deletePost && (
          <PostDeleteModal
            post={deletePost}
            onConfirm={() => {
              setDeletePost(null);
              setRefreshList(true);
            }}
            onCancel={() => setDeletePost(null)}
            refreshList={refreshList}
            setRefreshList={setRefreshList}
          />
        )}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/users" />} />

          {/* User Routes */}
          {hasAccess('users') && (
            <>
              <Route path="/users" element={
                <UserList
                  onCreateUser={() => { setSelectedUser(null); navigate('/users/create'); }}
                  onEditUser={(user) => { setSelectedUser(user); navigate(`/users/edit/${user._id}`); }}
                  onViewUser={setViewUser}
                  onDeleteUser={setDeleteUser}
                  refreshList={refreshList}
                />
              } />
              <Route path="/users/create" element={
                <UserForm
                  user={null}
                  onSave={() => { setSelectedUser(null); navigate('/users'); }}
                  onCancel={() => { setSelectedUser(null); navigate('/users'); }}
                />
              } />
              <Route path="/users/edit/:id" element={
                <UserForm
                  user={selectedUser}
                  onSave={() => { setSelectedUser(null); navigate('/users'); }}
                  onCancel={() => { setSelectedUser(null); navigate('/users'); }}
                />
              } />
            </>
          )}

          {/* Category Routes */}
          {hasAccess('categories') && (
            <>
              <Route path="/categories" element={
                <CategoryList
                  onCreateCategory={() => { setSelectedCategory(null); navigate('/categories/create'); }}
                  onEditCategory={(category) => { setSelectedCategory(category); navigate(`/categories/edit/${category._id}`); }}
                  refreshList={refreshList}
                />
              } />
              <Route path="/categories/create" element={
                <CategoryForm
                  category={null}
                  onSave={() => { setSelectedCategory(null); navigate('/categories'); }}
                  onCancel={() => { setSelectedCategory(null); navigate('/categories'); }}
                />
              } />
              <Route path="/categories/edit/:id" element={
                <CategoryForm
                  category={selectedCategory}
                  onSave={() => { setSelectedCategory(null); navigate('/categories'); }}
                  onCancel={() => { setSelectedCategory(null); navigate('/categories'); }}
                />
              } />
            </>
          )}

          {/* Post Routes */}
          {hasAccess('posts') && (
            <>
              <Route path="/posts" element={
                <PostList
                  onCreatePost={() => { setSelectedPost(null); navigate('/posts/create'); }}
                  onEditPost={(post) => { setSelectedPost(post); navigate(`/posts/edit/${post.id}`); }}
                  onViewPost={setViewPost}
                  onDeletePost={setDeletePost}
                  refreshList={refreshList}
                />
              } />
              <Route path="/posts/create" element={
                <PostForm
                  post={null}
                  onSave={() => { setSelectedPost(null); navigate('/posts'); }}
                  onCancel={() => { setSelectedPost(null); navigate('/posts'); }}
                />
              } />
              <Route path="/posts/edit/:id" element={
                <PostForm
                  post={selectedPost}
                  onSave={() => { setSelectedPost(null); navigate('/posts'); }}
                  onCancel={() => { setSelectedPost(null); navigate('/posts'); }}
                />
              } />
            </>
          )}

          {/* Order Routes */}
          {hasAccess('orders') && (
            <>
              <Route path="/orders" element={
                <OrderList
                  onCreateOrder={() => { setSelectedOrder(null); navigate('/orders/create'); }}
                  onEditOrder={(order) => { setSelectedOrder(order); navigate(`/orders/edit/${order.id}`); }}
                  refreshList={refreshList}
                />
              } />
              <Route path="/orders/create" element={
                <OrderForm
                  order={null}
                  onSave={() => { setSelectedOrder(null); navigate('/orders'); }}
                  onCancel={() => { setSelectedOrder(null); navigate('/orders'); }}
                />
              } />
              <Route path="/orders/edit/:id" element={
                <OrderForm
                  order={selectedOrder}
                  onSave={() => { setSelectedOrder(null); navigate('/orders'); }}
                  onCancel={() => { setSelectedOrder(null); navigate('/orders'); }}
                />
              } />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default AppWrapper;
