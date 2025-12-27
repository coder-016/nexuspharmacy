import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InventoryItem {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  unit: string;
  totalStock: string;
  batchNo: string;
  stock: string;
  minStock: string;
  rack: string;
  productType: string;
  price: string;
  gst: string;
}

// Mock data
const generateMockData = (): InventoryItem[] => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: `${i + 1}`,
    itemId: `XXXX`,
    itemName: "LOREM IPSUM",
    category: "LOREM IPSUM",
    unit: "XXXX",
    totalStock: "XXXXXX",
    batchNo: "XXXXX",
    stock: "XXXX",
    minStock: "XXX",
    rack: "XXXX",
    productType: "Lorem Ipsum",
    price: "₹ XXX",
    gst: "GSTR1",
  }));
};

const GetInventoryList = () => {
  const [searchParams] = useSearchParams();
  const [itemName, setItemName] = useState(searchParams.get("itemName") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const itemsPerPage = 14;

  const allItems = generateMockData();
  
  // Filter items based on search params
  const filteredItems = allItems.filter((item) => {
    const matchesName = !itemName || item.itemName.toLowerCase().includes(itemName.toLowerCase());
    const matchesCategory = !category || item.category.toLowerCase().includes(category.toLowerCase());
    return matchesName && matchesCategory;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleGetAll = () => {
    setItemName("");
    setCategory("");
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push("...");
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1, totalPages);
    }
    return [...new Set(pages)];
  };

  return (
    <DashboardLayout breadcrumbs={["Get Inventory", "Results"]}>
      <div className="space-y-4">
        {/* Search Form */}
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <button
              onClick={handleGetAll}
              className="text-primary font-medium text-sm hover:underline whitespace-nowrap"
            >
              GET ALL
            </button>
            <Button onClick={handleSearch} className="px-8">
              Search
            </Button>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <span className="font-medium text-foreground">Item Details</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold uppercase text-primary">Item ID</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-primary">Item Name</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-primary">Category</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-primary">Unit</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-primary">Total Stock</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-primary"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="text-sm">{item.itemId}</TableCell>
                  <TableCell className="text-sm">{item.itemName}</TableCell>
                  <TableCell className="text-sm">{item.category}</TableCell>
                  <TableCell className="text-sm">{item.unit}</TableCell>
                  <TableCell className="text-sm">{item.totalStock}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-primary font-medium text-sm hover:underline"
                    >
                      VIEW DETAILS
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={typeof page === "string"}
                className="min-w-[40px]"
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Item Details Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              # 0225280278
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              {/* Item Details Section */}
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-medium text-foreground mb-4">Item Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Item ID</label>
                    <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
                      {selectedItem.itemId}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Item Name</label>
                    <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
                      Lorem Ipsum
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Category</label>
                    <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
                      Lorem Ipsum
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Batch No</label>
                    <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
                      XXXXXX
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Unit</label>
                    <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
                      XXXX
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Stock</label>
                    <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
                      XXXX
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Minimum Stock</label>
                    <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
                      XXX
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Rack</label>
                    <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
                      XXXX
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Product type</label>
                    <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
                      Lorem Ipsum
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Price</label>
                    <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
                      ₹ XXX
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">GST</label>
                    <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
                      GSTR1
                    </div>
                  </div>
                </div>

                {/* Item Information Table */}
                <div className="mt-6">
                  <div className="border-b border-border pb-2 mb-4">
                    <span className="font-medium text-foreground text-sm">Item Information</span>
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="text-xs font-semibold uppercase">Item ID</TableHead>
                          <TableHead className="text-xs font-semibold uppercase">Item Name</TableHead>
                          <TableHead className="text-xs font-semibold uppercase">Category</TableHead>
                          <TableHead className="text-xs font-semibold uppercase">Batch No</TableHead>
                          <TableHead className="text-xs font-semibold uppercase">Unit</TableHead>
                          <TableHead className="text-xs font-semibold uppercase">Stock</TableHead>
                          <TableHead className="text-xs font-semibold uppercase">Min Stock</TableHead>
                          <TableHead className="text-xs font-semibold uppercase">Rack</TableHead>
                          <TableHead className="text-xs font-semibold uppercase">Product Type</TableHead>
                          <TableHead className="text-xs font-semibold uppercase">Price</TableHead>
                          <TableHead className="text-xs font-semibold uppercase">GST</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-sm">XXXX</TableCell>
                          <TableCell className="text-sm">Lorem Ipsum</TableCell>
                          <TableCell className="text-sm">Lorem Ipsum</TableCell>
                          <TableCell className="text-sm">XXXXX</TableCell>
                          <TableCell className="text-sm">XXXX</TableCell>
                          <TableCell className="text-sm">XXXX</TableCell>
                          <TableCell className="text-sm">XXX</TableCell>
                          <TableCell className="text-sm">XXXX</TableCell>
                          <TableCell className="text-sm">Lorem Ipsum</TableCell>
                          <TableCell className="text-sm">₹ XXX</TableCell>
                          <TableCell className="text-sm">GSTR1</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default GetInventoryList;
