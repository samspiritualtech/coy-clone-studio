import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, HelpCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSeller } from '@/contexts/SellerContext';
import { SupportTicket, TicketStatus } from '@/types/seller';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700' },
  resolved: { label: 'Resolved', className: 'bg-green-100 text-green-700' },
};

const SellerSupport = () => {
  const { seller } = useSeller();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['seller-tickets', seller?.id],
    queryFn: async () => {
      if (!seller?.id) return [];

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SupportTicket[];
    },
    enabled: !!seller?.id,
  });

  const createTicketMutation = useMutation({
    mutationFn: async () => {
      if (!seller?.id) throw new Error('Seller not found');

      const { error } = await supabase
        .from('support_tickets')
        .insert({
          seller_id: seller.id,
          subject,
          description,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-tickets'] });
      toast.success('Support ticket created');
      setIsDialogOpen(false);
      setSubject('');
      setDescription('');
    },
    onError: () => {
      toast.error('Failed to create ticket');
    },
  });

  const openTickets = (tickets || []).filter(t => t.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Support</h1>
          <p className="text-muted-foreground">
            Get help with your seller account
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about your issue..."
                  rows={4}
                />
              </div>
              <Button 
                onClick={() => createTicketMutation.mutate()}
                disabled={!subject || !description || createTicketMutation.isPending}
                className="w-full"
              >
                Submit Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold">{openTickets}</p>
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
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">
                  {(tickets || []).filter(t => t.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : tickets && tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.map((ticket) => {
                const status = statusConfig[ticket.status];
                
                return (
                  <div
                    key={ticket.id}
                    className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ticket.subject}</span>
                        <Badge className={status.className}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {ticket.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No tickets yet</p>
              <p className="text-sm text-muted-foreground">
                Create a ticket when you need help
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Help Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <a href="#" className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
            <span>Getting Started Guide</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
            <span>Product Listing Best Practices</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
            <span>Order Fulfillment Guidelines</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerSupport;
