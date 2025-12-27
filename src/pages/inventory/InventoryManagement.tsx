import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, Check } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InventoryItem {
  id: string;
  itemName: string;
  itemId: string;
  category: string;
  batchNo: string;
  unit: string;
  stock: string;
  minStock: string;
  rack: string;
  productType: string;
}

const mockItems = [
  { label: "Paracetamol 500mg", value: "paracetamol" },
  { label: "Amoxicillin 250mg", value: "amoxicillin" },
  { label: "Omeprazole 20mg", value: "omeprazole" },
  { label: "Metformin 500mg", value: "metformin" },
];

const InventoryManagement = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [updated, setUpdated] = useState(false);
  const [formData, setFormData] = useState({
    itemId: "",
    category: "",
    batchNo: "",
    unit: "",
    stock: "",
    minStock: "",
    rack: "",
    productType: "",
  });
  const [items, setItems] = useState<InventoryItem[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    if (!selectedItem || !formData.itemId) return;

    const newItem: InventoryItem = {
      id: crypto.randomUUID(),
      itemName: mockItems.find((i) => i.value === selectedItem)?.label || selectedItem,
      itemId: formData.itemId,
      category: formData.category,
      batchNo: formData.batchNo,
      unit: formData.unit,
      stock: formData.stock,
      minStock: formData.minStock,
      rack: formData.rack,
      productType: formData.productType,
    };

    setItems((prev) => [...prev, newItem]);
    
    // Reset form
    setSelectedItem("");
    setFormData({
      itemId: "",
      category: "",
      batchNo: "",
      unit: "",
      stock: "",
      minStock: "",
      rack: "",
      productType: "",
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdate = () => {
    setUpdated(true);
    setTimeout(() => setUpdated(false), 2000);
  };

  return (
    <DashboardLayout breadcrumbs={["Inventory"]}>
      <div className="space-y-6">
        {/* Material Information Tab */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="border-b border-border">
            <div className="px-4 py-3 bg-muted/30">
              <span className="font-medium text-foreground">Material Information</span>
            </div>
          </div>

          <div className="p-6">
            {/* Item Details Header */}
            <div className="flex items-center gap-2 mb-6">
              <span className="font-medium text-foreground">Item Details</span>
              <button
                onClick={handleAddItem}
                className="text-primary font-medium text-sm hover:underline"
              >
                Add
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              {/* Item Name with Search Dropdown */}
              <div className="space-y-2">
                <Label>
                  Item Name<span className="text-primary">*</span>
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-start font-normal"
                    >
                      <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                      {selectedItem
                        ? mockItems.find((item) => item.value === selectedItem)?.label
                        : "Lorem Ipsum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search item..." />
                      <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                          {mockItems.map((item) => (
                            <CommandItem
                              key={item.value}
                              value={item.value}
                              onSelect={(value) => {
                                setSelectedItem(value);
                                setOpen(false);
                              }}
                            >
                              {item.label}
                            </CommandItem>
                          ))}
                          <CommandItem className="text-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Item ID */}
              <div className="space-y-2">
                <Label>
                  Item ID<span className="text-primary">*</span>
                </Label>
                <Input
                  placeholder="XXXXXX"
                  value={formData.itemId}
                  onChange={(e) => handleInputChange("itemId", e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>
                  Category<span className="text-primary">*</span>
                </Label>
                <Input
                  placeholder="Lorem Ipsum"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                />
              </div>

              {/* Batch No */}
              <div className="space-y-2">
                <Label>
                  Batch No<span className="text-primary">*</span>
                </Label>
                <Input
                  placeholder="xxxxx"
                  value={formData.batchNo}
                  onChange={(e) => handleInputChange("batchNo", e.target.value)}
                />
              </div>

              {/* Unit */}
              <div className="space-y-2">
                <Label>
                  Unit<span className="text-primary">*</span>
                </Label>
                <Input
                  placeholder="XXXX"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label>
                  Stock<span className="text-primary">*</span>
                </Label>
                <Input
                  placeholder="XXXXX"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                />
              </div>

              {/* Minimum Stock */}
              <div className="space-y-2">
                <Label>
                  Minimum Stock<span className="text-primary">*</span>
                </Label>
                <Input
                  placeholder="XXXXX"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange("minStock", e.target.value)}
                />
              </div>

              {/* Rack */}
              <div className="space-y-2">
                <Label>Rack</Label>
                <Input
                  placeholder="loremm"
                  value={formData.rack}
                  onChange={(e) => handleInputChange("rack", e.target.value)}
                />
              </div>

              {/* Product Type */}
              <div className="space-y-2">
                <Label>Product type</Label>
                <Input
                  placeholder="Lorem Ipsum"
                  value={formData.productType}
                  onChange={(e) => handleInputChange("productType", e.target.value)}
                />
              </div>
            </div>

            {/* Item Details Table */}
            {items.length > 0 && (
              <div className="mt-6">
                <div className="border-b border-border pb-2 mb-4">
                  <span className="font-medium text-foreground">Item Details</span>
                </div>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs font-semibold uppercase">Item Name</TableHead>
                        <TableHead className="text-xs font-semibold uppercase">Item ID</TableHead>
                        <TableHead className="text-xs font-semibold uppercase">Category</TableHead>
                        <TableHead className="text-xs font-semibold uppercase">Batch No</TableHead>
                        <TableHead className="text-xs font-semibold uppercase">Unit</TableHead>
                        <TableHead className="text-xs font-semibold uppercase">Stock</TableHead>
                        <TableHead className="text-xs font-semibold uppercase">Min. Stock</TableHead>
                        <TableHead className="text-xs font-semibold uppercase">Rack</TableHead>
                        <TableHead className="text-xs font-semibold uppercase">Product Type</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-sm">{item.itemName}</TableCell>
                          <TableCell className="text-sm">{item.itemId}</TableCell>
                          <TableCell className="text-sm">{item.category}</TableCell>
                          <TableCell className="text-sm">{item.batchNo}</TableCell>
                          <TableCell className="text-sm">{item.unit}</TableCell>
                          <TableCell className="text-sm">{item.stock}</TableCell>
                          <TableCell className="text-sm">{item.minStock}</TableCell>
                          <TableCell className="text-sm">{item.rack}</TableCell>
                          <TableCell className="text-sm">{item.productType}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
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
              </div>
            )}
          </div>
        </div>

        {/* Update Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleUpdate}
            className={`${
              updated
                ? "bg-green-500 hover:bg-green-600"
                : "bg-primary hover:bg-primary/90"
            } text-primary-foreground px-8`}
          >
            {updated ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Updated
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InventoryManagement;
