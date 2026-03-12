import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const DashboardSettings = () => (
  <div className="space-y-6 max-w-2xl">
    <h1 className="text-xl font-semibold text-foreground">Settings</h1>

    <Card className="shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Store details</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs font-medium">Store name</Label>
          <Input defaultValue="Ogura Store" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium">Store email</Label>
          <Input defaultValue="store@ogura.in" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium">Store description</Label>
          <Textarea defaultValue="Custom fashion marketplace" className="mt-1" />
        </div>
      </CardContent>
    </Card>

    <Card className="shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Address</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium">City</Label>
            <Input defaultValue="Mumbai" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-medium">State</Label>
            <Input defaultValue="Maharashtra" className="mt-1" />
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium">Country</Label>
          <Input defaultValue="India" className="mt-1" />
        </div>
      </CardContent>
    </Card>

    <div className="flex justify-end">
      <Button>Save</Button>
    </div>
  </div>
);
