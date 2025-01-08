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
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (data) setUsers(data);
    if (error) console.error('Error fetching users:', error);
  };

  const handleUserAdded = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setShowAddForm(false);
  };

  const deleteUser = async (id: string) => {
    try {  
      // Eliminar al usuario de la tabla `users`
      const { error: userDeleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
  
      if (userDeleteError) {
        console.error('Error deleting user from users table:', userDeleteError.message);
      } else {
        // Actualizar el estado para reflejar los cambios en la tabla
        setUsers(users.filter((user) => user.id !== id));
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

          {showAddForm && (
            <AddUserForm onUserAdded={handleUserAdded} />
          )}

          <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead className="hidden md:table-cell">Rol</TableHead>
                  <TableHead className="hidden md:table-cell">Phone Number</TableHead>
                  <TableHead className="hidden md:table-cell">Username</TableHead>
                  <TableHead className="hidden md:table-cell">Password</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.rol}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.phonenumber}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.username}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.password}</TableCell>
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
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
