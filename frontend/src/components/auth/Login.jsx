import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
        <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
          <h1 className='font-bold text-xl mb-5'>Login</h1>
          <div className='my-2'>
            <Label>Email</Label>
            <Input type="email" name="email" value={input.email} onChange={changeHandler} placeholder="you@example.com" />
          </div>
          <div className='my-2'>
            <Label>Password</Label>
            <Input type="password" name="password" value={input.password} onChange={changeHandler} placeholder="••••••" />
          </div>
          <RadioGroup className="flex gap-4 my-5">
            <div className="flex items-center space-x-2">
              <Input type="radio" name="role" value="student" checked={input.role === 'student'} onChange={changeHandler} />
              <Label>Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange={changeHandler} />
              <Label>Recruiter</Label>
            </div>
          </RadioGroup>
          {loading
            ? <Button className="w-full"><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Logging in...</Button>
            : <Button type="submit" className="w-full">Login</Button>
          }
          <p className='text-sm mt-2'>Don't have an account? <Link to="/signup" className='text-blue-600'>Sign up</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
