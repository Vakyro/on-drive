'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';
import AddUserForm from './AddUserForm';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  rol: string;
  phonenumber: string;
  username: string;
  password: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (data) setUsers(data);
    if (error) console.error('Error fetching users:', error);
  };

  const handleUserAdded = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setShowAddForm(false);
  };

  const deleteUser = async (id: string) => {
    try {
      const { error: userDeleteError } = await supabase.from('users').delete().eq('id', id);
      if (!userDeleteError) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        console.error('Error deleting user:', userDeleteError.message);
      }
    } catch (error) {
      console.error('Unexpected error deleting user:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full sm:w-auto">
            {showAddForm ? 'Close Add User Form' : 'Add New User'}
          </Button>
          {showAddForm && <AddUserForm onUserAdded={handleUserAdded} />}
          <div className="overflow-x-auto">
            <Table className="hidden md:table">
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.rol}</TableCell>
                    <TableCell>{user.phonenumber}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.password}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-md p-4 space-y-2 bg-gray-50"
                >
                  <p><strong>Id:</strong> {user.id}</p>
                  <p><strong>Name:</strong> {user.firstname}</p>
                  <p><strong>Last Name:</strong> {user.lastname}</p>
                  <p><strong>Rol:</strong> {user.rol}</p>
                  <p><strong>Phone Number:</strong> {user.phonenumber}</p>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Password:</strong> {user.password}</p>
                  <div className="flex space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
