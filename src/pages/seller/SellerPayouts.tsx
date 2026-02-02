import { Wallet, Clock, CheckCircle2, ArrowDownToLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSeller } from '@/contexts/SellerContext';
import { Payout, PayoutStatus } from '@/types/seller';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const statusConfig: Record<PayoutStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-700' },
};

const SellerPayouts = () => {
  const { seller } = useSeller();

  const { data: payouts, isLoading } = useQuery({
    queryKey: ['seller-payouts', seller?.id],
    queryFn: async () => {
      if (!seller?.id) return [];

      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Payout[];
    },
    enabled: !!seller?.id,
  });

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const pendingAmount = (payouts || [])
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const completedAmount = (payouts || [])
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Payouts</h1>
        <p className="text-muted-foreground">
          Track your earnings and settlements
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{formatPrice(pendingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-2xl font-bold">{formatPrice(completedAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <ArrowDownToLine className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Settlement Cycle</p>
                <p className="text-lg font-medium">Weekly (Every Monday)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payouts List */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : payouts && payouts.length > 0 ? (
            <div className="space-y-3">
              {payouts.map((payout) => {
                const status = statusConfig[payout.status];
                
                return (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatPrice(payout.amount)}</span>
                        <Badge className={status.className}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {payout.settlement_cycle || 'Weekly settlement'} • 
                        {payout.payout_date 
                          ? format(new Date(payout.payout_date), ' MMM d, yyyy')
                          : ' Pending'}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      Created {format(new Date(payout.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No payouts yet</p>
              <p className="text-sm text-muted-foreground">
                Payouts will appear here after you complete orders
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">How Payouts Work</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Orders are added to your pending balance once shipped</li>
            <li>• Settlements are processed every Monday for the previous week</li>
            <li>• Funds are transferred to your registered bank account within 2-3 business days</li>
            <li>• Make sure your bank details are up to date in Settings</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerPayouts;
