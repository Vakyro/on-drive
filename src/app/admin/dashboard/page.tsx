'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Truck, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  users: number
  deliveries: number
  openIssues: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    deliveries: 0,
    openIssues: 0
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    const { data: users } = await supabase
      .from('users')
      .select('id', { count: 'exact' })

    const { data: deliveries } = await supabase
      .from('deliveries')
      .select('id', { count: 'exact' })

    const { data: openIssues } = await supabase
      .from('repairreport')
      .select('id', { count: 'exact' })

    setStats({
      users: users?.length || 0,
      deliveries: deliveries?.length || 0,
      openIssues: openIssues?.length || 0
    })
  }

  const dashboardItems = [
    { title: 'Users', value: stats.users, icon: Users, href: '/admin/users' },
    { title: 'Deliveries', value: stats.deliveries, icon: Truck, href: '/admin/deliveries' },
    { title: 'Open Issues', value: stats.openIssues, icon: AlertTriangle, href: '/admin/issues' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardItems.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <Link href={item.href} className="text-xs text-muted-foreground hover:underline">
                View details
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

