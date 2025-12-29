import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Search, FileText, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

interface Bill {
  id: string;
  patientName: string;
  phoneNumber: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  createdBy: string;
}

const GetBillTemplate = () => {
  const { user } = useAuth();

  const [searchId, setSearchId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchDate, setSearchDate] = useState<Date | undefined>();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPatientFilter, setSearchPatientFilter] = useState("");
  const itemsPerPage = 14;

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);

    // Mock data for demonstration
    const mockBills: Bill[] = Array.from({ length: 42 }, (_, i) => ({
      id: `XXX`,
      patientName: "LOREM IPSUM",
      phoneNumber: "+91XXXXXXXXXX",
      totalAmount: 99999,
      paymentStatus: "ADVANCE PAID",
      createdAt: "DD-MM-YY",
      createdBy: "LOREM",
    }));

    setBills(mockBills);
    setCurrentPage(1);
    setLoading(false);
  };

  const filteredBills = searchPatientFilter
    ? bills.filter((bill) =>
        bill.patientName.toLowerCase().includes(searchPatientFilter.toLowerCase())
      )
    : bills;

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout breadcrumbs={["Bill Template", "Get"]}>
      {/* Search Form */}
      <div className="bg-card rounded-xl shadow-card p-6 mb-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="pl-10"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !searchDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchDate ? format(searchDate, "dd-MM-yy") : "DD-MM-YY"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={searchDate}
                onSelect={setSearchDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      {/* Results Table */}
      {searched && (
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-foreground px-3 py-1 bg-muted rounded">Rate Chart</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search Patient Name"
                  value={searchPatientFilter}
                  onChange={(e) => setSearchPatientFilter(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <button className="flex items-center gap-1 text-primary text-sm">
                Edit <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#e8f5e9]">
                <TableHead className="text-foreground font-semibold">BILL ID</TableHead>
                <TableHead className="text-foreground font-semibold">PATIENT NAME</TableHead>
                <TableHead className="text-foreground font-semibold">PHONE NUMBER</TableHead>
                <TableHead className="text-foreground font-semibold">TOTAL AMOUNT</TableHead>
                <TableHead className="text-foreground font-semibold">PAYMENT STATUS</TableHead>
                <TableHead className="text-foreground font-semibold">CREATED AT</TableHead>
                <TableHead className="text-foreground font-semibold">CREATED BY</TableHead>
                <TableHead className="text-foreground font-semibold">BILL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No bills found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBills.map((bill, index) => (
                  <TableRow key={index}>
                    <TableCell>{bill.id}</TableCell>
                    <TableCell>{bill.patientName}</TableCell>
                    <TableCell>{bill.phoneNumber}</TableCell>
                    <TableCell>₹{bill.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{bill.paymentStatus}</TableCell>
                    <TableCell>{bill.createdAt}</TableCell>
                    <TableCell>{bill.createdBy}</TableCell>
                    <TableCell>
                      <button className="text-primary hover:text-primary/80">
                        <FileText className="w-5 h-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer text-primary"}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {totalPages > 3 && (
                    <>
                      <PaginationItem>
                        <span className="px-2">...</span>
                      </PaginationItem>
                      {Array.from({ length: 3 }, (_, i) => totalPages - 2 + i).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    </>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer text-primary"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default GetBillTemplate;
