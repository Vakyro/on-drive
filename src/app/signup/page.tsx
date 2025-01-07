'use client'
import { useState } from 'react';
import { registerUser } from './actions'; // Importamos la función desde registerUser.ts

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    rol: '',
    phonenumber: '',
    username: '',
    password: '',
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);  // Limpiar mensaje previo

    try {
      const result = await registerUser(formData);  // Llamamos a la función desde el archivo ts
      setMessage(result);
      setFormData({
        firstname: '',
        lastname: '',
        rol: '',
        phonenumber: '',
        username: '',
        password: '',
      });  // Resetear formulario
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add New User</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstname">First Name:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="lastname">Last Name:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="rol">Role:</label>
          <input
            type="text"
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="phonenumber">Phone Number:</label>
          <input
            type="text"
            id="phonenumber"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
