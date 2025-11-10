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
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null
  });

  const { loading, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
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
          <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
          <div className='my-2'>
            <Label>Full Name</Label>
            <Input type="text" name="fullname" value={input.fullname} onChange={changeHandler} placeholder="Your Name" />
          </div>
          <div className='my-2'>
            <Label>Email</Label>
            <Input type="email" name="email" value={input.email} onChange={changeHandler} placeholder="you@example.com" />
          </div>
          <div className='my-2'>
            <Label>Phone Number</Label>
            <Input type="text" name="phoneNumber" value={input.phoneNumber} onChange={changeHandler} placeholder="9876543210" />
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
          <div className='my-2'>
            <Label>Profile Picture</Label>
            <Input type="file" accept="image/*" onChange={fileChangeHandler} />
          </div>
          {loading
            ? <Button className="w-full"><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Signing up...</Button>
            : <Button type="submit" className="w-full">Sign Up</Button>
          }
          <p className='text-sm mt-2'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
