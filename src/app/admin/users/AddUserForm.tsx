'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registerUser } from './actions';

interface AddUserFormProps {
  //@ts-ignore
  onUserAdded: (newUser: User) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    rol: '',
    phonenumber: '',
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, rol: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newUser = await registerUser(formData); // Registrar usuario y obtener datos
      onUserAdded(newUser); // Llamar al callback para actualizar la tabla
      setFormData({
        firstname: '',
        lastname: '',
        rol: '',
        phonenumber: '',
        username: '',
        password: '',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
      <Input name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleInputChange} />
      <Input name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleInputChange} />
      <Select value={formData.rol} onValueChange={handleRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="driver">Driver</SelectItem>
        </SelectContent>
      </Select>
      <Input name="phonenumber" placeholder="Phone Number" value={formData.phonenumber} onChange={handleInputChange} />
      <Input name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
      <Input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleInputChange} />
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? 'Adding...' : 'Add User'}
      </Button>
    </form>
  );
};

export default AddUserForm;
