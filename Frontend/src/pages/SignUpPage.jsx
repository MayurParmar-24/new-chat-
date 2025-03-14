import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { Mail, MessageSquare, User } from 'lucide-react';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const { SignUp, issigningUP } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      alert('Please fill all fields');
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      SignUp(formData);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-900 text-white">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-purple-600 flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                <MessageSquare className="size-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mt-2">Create Account</h1>
            <p className="text-gray-400">
              Get started with your free account
            </p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-400 font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                placeholder="Your Name Here"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
