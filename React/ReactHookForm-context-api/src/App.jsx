import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const App = () => {
  // GET Data from localStorage on initial render
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('usersData');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [editId, setEditId] = useState(null);
  const[togle, setTogle] = useState(false);

  // SET Data to localStorage whenever users state updates
  useEffect(() => {
    localStorage.setItem('usersData', JSON.stringify(users));
  }, [users]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Create & Update Handler
  const onSubmit = (data) => {
    if (editId !== null) {
      // UPDATE Operation
      setUsers(
        users.map((user) => (user.id === editId ? { ...data, id: editId } : user))
      );
      setEditId(null);
    } else {
      // CREATE Operation
      setUsers([...users, { ...data, id: Date.now() }]);
    }
    reset({ name: '', email: '', password: '', phone: '' });
  };

  // Edit (Populate form for Update)
  const handleEdit = (user) => {
    setEditId(user.id);
    reset({
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
    });
  };

  // Cancel Editing
  const handleCancel = () => {
    setEditId(null);
    reset({ name: '', email: '', password: '', phone: '' });
  };

  // DELETE Operation
  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    if (editId === id) {
      handleCancel();
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className=" pb-5 text-center md:text-left">
          <h1 className="text-3xl font-bold bg-gray-800 bg-clip-text text-transparent">
            React Hook Form - CRUD Setup
          </h1>
         
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
         

          {/* READ / TABLE SECTION */}
          <div className="lg:col-span-2 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">📋 Users List</h2>
              <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                Total Users: {users.length}
              </span>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-12 rounded-xl">
                <p className="text-slate-400 text-sm">No users added yet.</p>
                <p className="text-slate-500 text-xs mt-1">Fill out the form on the left to add one.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-900 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs uppercase text-slate-600">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                      >
                        <td className="py-3 px-4 font-medium ">{user.name}</td>
                        <td className="py-3 px-4 font-medium ">{user.email}</td>
                        <td className="py-3 px-4 font-medium ">{user.phone}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="px-3 py-1 text-white bg-amber-500 rounded text-xs transition border border-amber-500/30"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 text-white bg-rose-500 rounded text-xs transition border border-rose-500/30"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
            
          {/* FORM SECTION (Create / Update) */}
          {togle ? 

          <div className="lg:col-span-1 bg-slate-100 backdrop-blur-md p-6 rounded-2xl border border-slate-700 shadow-xl h-fit">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
              <span>{editId !== null ? ' Edit User' : ' Add New User'}</span>
             
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Name Input */}
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  placeholder="Enter full name"
                  className="w-full border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {errors.name && (
                  <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">Email</label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full  border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {errors.email && (
                  <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">Password</label>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full  border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {errors.password && (
                  <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">Phone</label>
                <input
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Enter a valid 10-digit phone number',
                    },
                  })}
                  type="tel"
                  placeholder="10-digit number"
                  className="w-full  border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {errors.phone && (
                  <p className="text-rose-400 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm text-white transition shadow-lg ${
                    editId !== null
                      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                  }`}
                >
                  {editId !== null ? 'Update User' : 'Add User'}
                </button>

                {editId !== null && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-1/3 py-2.5 px-3 rounded-lg font-medium text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </form>
          </div> : <button
            type="button"
            onClick={() => setTogle(true)}
            className="w-full py-2.5 px-4 rounded-lg font-medium text-sm text-white transition shadow-lg bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
          >
            Add User
          </button>
          }

        </div>
      </div>
    </div>
  );
};

export default App;