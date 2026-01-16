import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { cn } from "@/lib/utils";

interface IssueOrderDetail {
  id: string;
  employee_type: string;
  employee_name: string;
  issue_date: Date;
  remark: string;
}

interface ItemDetail {
  id: string;
  item_id: string;
  item_name: string;
  quantity: number;
  remark: string;
}

const CreateIssueOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Issue Order Details
  const [employeeType, setEmployeeType] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [issueDate, setIssueDate] = useState<Date>();
  const [orderRemark, setOrderRemark] = useState("");
  const [orderDetails, setOrderDetails] = useState<IssueOrderDetail[]>([]);

  // Item Details
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [itemRemark, setItemRemark] = useState("");
  const [itemDetails, setItemDetails] = useState<ItemDetail[]>([]);

  const handleAddOrderDetail = () => {
    if (!employeeType || !employeeName || !issueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newDetail: IssueOrderDetail = {
      id: crypto.randomUUID(),
      employee_type: employeeType,
      employee_name: employeeName,
      issue_date: issueDate,
      remark: orderRemark,
    };

    setOrderDetails([...orderDetails, newDetail]);
    setEmployeeType("");
    setEmployeeName("");
    setIssueDate(undefined);
    setOrderRemark("");
  };

  const handleRemoveOrderDetail = (id: string) => {
    setOrderDetails(orderDetails.filter((d) => d.id !== id));
  };

  const handleAddItemDetail = () => {
    if (!itemName || !quantity) {
      toast.error("Please fill in Item Name and Quantity");
      return;
    }

    const newItem: ItemDetail = {
      id: crypto.randomUUID(),
      item_id: itemId || `ITEM-${Date.now()}`,
      item_name: itemName,
      quantity: parseInt(quantity),
      remark: itemRemark,
    };

    setItemDetails([...itemDetails, newItem]);
    setItemId("");
    setItemName("");
    setQuantity("");
    setItemRemark("");
  };

  const handleRemoveItemDetail = (id: string) => {
    setItemDetails(itemDetails.filter((i) => i.id !== id));
  };

  const handleSave = async () => {
    if (orderDetails.length === 0) {
      toast.error("Please add at least one issue order detail");
      return;
    }

    if (itemDetails.length === 0) {
      toast.error("Please add at least one item detail");
      return;
    }

    setIsLoading(true);

    try {
      for (const order of orderDetails) {
        const { data: issueOrder, error: orderError } = await supabase
          .from("issue_orders")
          .insert({
            user_id: user?.id,
            employee_type: order.employee_type,
            employee_name: order.employee_name,
            issue_date: format(order.issue_date, "yyyy-MM-dd"),
            remark: order.remark,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        const orderItems = itemDetails.map((item) => ({
          issue_order_id: issueOrder.id,
          user_id: user?.id,
          item_id: item.item_id,
          item_name: item.item_name,
          quantity: item.quantity,
          remark: item.remark,
        }));

        const { error: itemsError } = await supabase
          .from("issue_order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      toast.success("Issue order created successfully!");
      navigate("/dashboard/issue-orders");
    } catch (error: any) {
      toast.error(error.message || "Failed to create issue order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout breadcrumbs={["Inventory Management", "Issue Order", "Create"]}>
      <div className="bg-card rounded-xl shadow-card p-6">
        <div className="border-b border-border mb-6">
          <div className="inline-block px-4 py-2 border-b-2 border-primary font-medium text-foreground">
            Issue Order Information
          </div>
        </div>

        {/* Issue Order Details Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-foreground">Issue Order Details</h3>
            <button
              onClick={handleAddOrderDetail}
              className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <Label className="text-sm text-foreground">
                Employee Type<span className="text-destructive">*</span>
              </Label>
              <Select value={employeeType} onValueChange={setEmployeeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Employee Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-foreground">
                Employee Name<span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Enter employee name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="border-primary"
              />
            </div>

            <div>
              <Label className="text-sm text-foreground">
                Issue Date<span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issueDate ? format(issueDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50">
                  <Calendar
                    mode="single"
                    selected={issueDate}
                    onSelect={setIssueDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm text-foreground">Remark</Label>
              <Input
                placeholder="Enter remark"
                value={orderRemark}
                onChange={(e) => setOrderRemark(e.target.value)}
              />
            </div>
          </div>

          {orderDetails.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden mb-6">
              <div className="bg-muted/50 px-4 py-2 font-medium text-foreground">
                Issue Order Details
              </div>
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead className="text-xs uppercase">Employee Type</TableHead>
                    <TableHead className="text-xs uppercase">Employee Name</TableHead>
                    <TableHead className="text-xs uppercase">Issue Date</TableHead>
                    <TableHead className="text-xs uppercase">Remark</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell>{detail.employee_type}</TableCell>
                      <TableCell>{detail.employee_name}</TableCell>
                      <TableCell>{format(detail.issue_date, "dd-MM-yyyy")}</TableCell>
                      <TableCell>{detail.remark || "-"}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleRemoveOrderDetail(detail.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Item Details Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-foreground">Item Details</h3>
            <button
              onClick={handleAddItemDetail}
              className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <Label className="text-sm text-foreground">Item ID</Label>
              <Input
                placeholder="xxxxxx"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="bg-muted"
              />
            </div>

            <div>
              <Label className="text-sm text-foreground">
                Item Name<span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="border-primary"
              />
            </div>

            <div>
              <Label className="text-sm text-foreground">
                Quantity<span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-muted"
              />
            </div>

            <div>
              <Label className="text-sm text-foreground">Remark</Label>
              <Input
                placeholder="Enter remark"
                value={itemRemark}
                onChange={(e) => setItemRemark(e.target.value)}
              />
            </div>
          </div>

          {itemDetails.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 font-medium text-foreground">
                Item Details
              </div>
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead className="text-xs uppercase">Item ID</TableHead>
                    <TableHead className="text-xs uppercase">Item Name</TableHead>
                    <TableHead className="text-xs uppercase">Quantity</TableHead>
                    <TableHead className="text-xs uppercase">Remark</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemDetails.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.item_id}</TableCell>
                      <TableCell>{item.item_name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.remark || "-"}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleRemoveItemDetail(item.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateIssueOrder;
