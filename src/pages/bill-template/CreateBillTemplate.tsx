import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";

interface FieldConfig {
  enabled: boolean;
  value?: string;
}

interface BillTemplateConfig {
  // Pharmacy Information
  pharmacyEnabled: boolean;
  logo: FieldConfig & { file?: File };
  address: FieldConfig;
  fssai: FieldConfig;
  gstin: FieldConfig;

  // Drug License Information
  drugLicenseEnabled: boolean;
  dlNumber1: FieldConfig;
  dlNumber2: FieldConfig;

  // Patient Information
  patientEnabled: boolean;
  patientName: FieldConfig;
  phoneNumber: FieldConfig;
  age: FieldConfig;
  gender: FieldConfig;
  patientAddress: FieldConfig;
  doctorName: FieldConfig;

  // Item Information
  itemEnabled: boolean;
  itemName: FieldConfig;
  quantity: FieldConfig;
  hsn: FieldConfig;
  batch: FieldConfig;
  expiry: FieldConfig;
  mrp: FieldConfig;
  gstPercent: FieldConfig;
  discount: FieldConfig;
  total: FieldConfig;

  // GST Information
  gstEnabled: boolean;
  gstPercentInfo: FieldConfig;
  taxAmount: FieldConfig;
  cgst: FieldConfig;
  sgst: FieldConfig;
  totalGst: FieldConfig;

  // Payment Information
  paymentEnabled: boolean;
  amountPaid: FieldConfig;
  paymentMethod: FieldConfig;
  paymentStatus: FieldConfig;
  totalDiscount: FieldConfig;
  totalBill: FieldConfig;
  outstandingAmount: FieldConfig;

  // Declaration Information
  declarationEnabled: boolean;
  signature: FieldConfig & { file?: File };
  termsAndConditions: FieldConfig;
  remark: FieldConfig;
}

const CreateBillTemplate = () => {
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);

  const [config, setConfig] = useState<BillTemplateConfig>({
    pharmacyEnabled: true,
    logo: { enabled: true },
    address: { enabled: true, value: "" },
    fssai: { enabled: true },
    gstin: { enabled: true },

    drugLicenseEnabled: true,
    dlNumber1: { enabled: true, value: "" },
    dlNumber2: { enabled: true, value: "" },

    patientEnabled: true,
    patientName: { enabled: true },
    phoneNumber: { enabled: true },
    age: { enabled: true },
    gender: { enabled: true },
    patientAddress: { enabled: true },
    doctorName: { enabled: false },

    itemEnabled: true,
    itemName: { enabled: true },
    quantity: { enabled: true },
    hsn: { enabled: true },
    batch: { enabled: false },
    expiry: { enabled: true },
    mrp: { enabled: true },
    gstPercent: { enabled: true },
    discount: { enabled: true },
    total: { enabled: true },

    gstEnabled: false,
    gstPercentInfo: { enabled: false },
    taxAmount: { enabled: false },
    cgst: { enabled: false },
    sgst: { enabled: false },
    totalGst: { enabled: false },

    paymentEnabled: true,
    amountPaid: { enabled: true },
    paymentMethod: { enabled: false },
    paymentStatus: { enabled: false },
    totalDiscount: { enabled: true },
    totalBill: { enabled: true },
    outstandingAmount: { enabled: true },

    declarationEnabled: true,
    signature: { enabled: true },
    termsAndConditions: { enabled: true, value: "" },
    remark: { enabled: true, value: "" },
  });

  const updateField = (fieldPath: string, value: boolean | string | File) => {
    setConfig((prev) => {
      const keys = fieldPath.split(".");
      const newConfig = { ...prev };
      let current: any = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      const lastKey = keys[keys.length - 1];
      if (typeof value === "boolean" && lastKey === "enabled") {
        current.enabled = value;
      } else if (lastKey === "value") {
        current.value = value as string;
      } else if (lastKey === "file") {
        current.file = value as File;
      } else {
        current[lastKey] = value;
      }
      
      return newConfig;
    });
  };

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Bill template saved successfully",
    });
  };

  const ToggleField = ({ 
    label, 
    enabled, 
    onToggle,
    showInput = false,
    inputValue = "",
    onInputChange,
    showUpload = false,
    fileName = "",
    onUpload,
  }: {
    label: string;
    enabled: boolean;
    onToggle: (val: boolean) => void;
    showInput?: boolean;
    inputValue?: string;
    onInputChange?: (val: string) => void;
    showUpload?: boolean;
    fileName?: string;
    onUpload?: (file: File) => void;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium min-w-[120px]">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${!enabled ? "text-foreground" : "text-muted-foreground"}`}>Disable</span>
          <Switch checked={enabled} onCheckedChange={onToggle} />
          <span className={`text-xs ${enabled ? "text-foreground" : "text-muted-foreground"}`}>Enable</span>
        </div>
      </div>
      {showInput && enabled && (
        <Input
          value={inputValue}
          onChange={(e) => onInputChange?.(e.target.value)}
          placeholder="Lorem Ipsum is simply dummy text"
          className="max-w-xs"
        />
      )}
      {showUpload && enabled && (
        <div className="flex items-center gap-2">
          <Label htmlFor={`upload-${label}`} className="cursor-pointer">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-primary text-primary rounded-md text-sm hover:bg-primary/5">
              <Upload className="w-4 h-4" />
              Upload
            </div>
          </Label>
          <input
            id={`upload-${label}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                onUpload?.(e.target.files[0]);
              }
            }}
          />
          {fileName && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md text-sm">
              <FileText className="w-4 h-4" />
              <span>{fileName}</span>
              <span className="text-xs text-muted-foreground">200 KB</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const SectionHeader = ({ 
    title, 
    enabled, 
    onToggle 
  }: { 
    title: string; 
    enabled: boolean; 
    onToggle: (val: boolean) => void;
  }) => (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-t-lg border-b border-border">
      <span className="font-semibold">{title}</span>
      <div className="flex items-center gap-2">
        <span className={`text-xs ${!enabled ? "text-foreground" : "text-muted-foreground"}`}>Disable</span>
        <Switch checked={enabled} onCheckedChange={onToggle} />
        <span className={`text-xs ${enabled ? "text-foreground" : "text-muted-foreground"}`}>Enable</span>
      </div>
    </div>
  );

  return (
    <DashboardLayout breadcrumbs={["Bill Template", "Create"]}>
      <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
        <span>Bill Template</span>
        <span>›</span>
        <span className="text-foreground font-medium">Create</span>
      </div>

      <div className="space-y-6">
        {/* Pharmacy Information */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <SectionHeader
            title="Pharmacy Information"
            enabled={config.pharmacyEnabled}
            onToggle={(val) => setConfig((prev) => ({ ...prev, pharmacyEnabled: val }))}
          />
          {config.pharmacyEnabled && (
            <div className="p-6 grid grid-cols-3 gap-6">
              <ToggleField
                label="Logo"
                enabled={config.logo.enabled}
                onToggle={(val) => updateField("logo.enabled", val)}
                showUpload
                fileName={config.logo.file?.name}
                onUpload={(file) => updateField("logo.file", file)}
              />
              <ToggleField
                label="Address"
                enabled={config.address.enabled}
                onToggle={(val) => updateField("address.enabled", val)}
                showInput
                inputValue={config.address.value}
                onInputChange={(val) => updateField("address.value", val)}
              />
              <ToggleField
                label="FSSAI"
                enabled={config.fssai.enabled}
                onToggle={(val) => updateField("fssai.enabled", val)}
              />
              <ToggleField
                label="GSTIN"
                enabled={config.gstin.enabled}
                onToggle={(val) => updateField("gstin.enabled", val)}
              />
            </div>
          )}
        </div>

        {/* Drug License Information */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <SectionHeader
            title="Drug License Information"
            enabled={config.drugLicenseEnabled}
            onToggle={(val) => setConfig((prev) => ({ ...prev, drugLicenseEnabled: val }))}
          />
          {config.drugLicenseEnabled && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-medium">DL Number</span>
                <button className="text-primary text-sm">Add</button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <ToggleField
                  label="DL Number 1"
                  enabled={config.dlNumber1.enabled}
                  onToggle={(val) => updateField("dlNumber1.enabled", val)}
                  showInput
                  inputValue={config.dlNumber1.value}
                  onInputChange={(val) => updateField("dlNumber1.value", val)}
                />
                <ToggleField
                  label="DL Number 2"
                  enabled={config.dlNumber2.enabled}
                  onToggle={(val) => updateField("dlNumber2.enabled", val)}
                  showInput
                  inputValue={config.dlNumber2.value}
                  onInputChange={(val) => updateField("dlNumber2.value", val)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Patient Information */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <SectionHeader
            title="Patient Information"
            enabled={config.patientEnabled}
            onToggle={(val) => setConfig((prev) => ({ ...prev, patientEnabled: val }))}
          />
          {config.patientEnabled && (
            <div className="p-6 grid grid-cols-3 gap-6">
              <ToggleField label="Patient Name" enabled={config.patientName.enabled} onToggle={(val) => updateField("patientName.enabled", val)} />
              <ToggleField label="Phone Number" enabled={config.phoneNumber.enabled} onToggle={(val) => updateField("phoneNumber.enabled", val)} />
              <ToggleField label="Age" enabled={config.age.enabled} onToggle={(val) => updateField("age.enabled", val)} />
              <ToggleField label="Gender" enabled={config.gender.enabled} onToggle={(val) => updateField("gender.enabled", val)} />
              <ToggleField label="Address" enabled={config.patientAddress.enabled} onToggle={(val) => updateField("patientAddress.enabled", val)} />
              <ToggleField label="Doctor Name" enabled={config.doctorName.enabled} onToggle={(val) => updateField("doctorName.enabled", val)} />
            </div>
          )}
        </div>

        {/* Item Information */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <SectionHeader
            title="Item Information"
            enabled={config.itemEnabled}
            onToggle={(val) => setConfig((prev) => ({ ...prev, itemEnabled: val }))}
          />
          {config.itemEnabled && (
            <div className="p-6 grid grid-cols-3 gap-6">
              <ToggleField label="Item Name" enabled={config.itemName.enabled} onToggle={(val) => updateField("itemName.enabled", val)} />
              <ToggleField label="Quantity" enabled={config.quantity.enabled} onToggle={(val) => updateField("quantity.enabled", val)} />
              <ToggleField label="HSN" enabled={config.hsn.enabled} onToggle={(val) => updateField("hsn.enabled", val)} />
              <ToggleField label="Batch" enabled={config.batch.enabled} onToggle={(val) => updateField("batch.enabled", val)} />
              <ToggleField label="Expiry" enabled={config.expiry.enabled} onToggle={(val) => updateField("expiry.enabled", val)} />
              <ToggleField label="MRP" enabled={config.mrp.enabled} onToggle={(val) => updateField("mrp.enabled", val)} />
              <ToggleField label="GST %" enabled={config.gstPercent.enabled} onToggle={(val) => updateField("gstPercent.enabled", val)} />
              <ToggleField label="Discount" enabled={config.discount.enabled} onToggle={(val) => updateField("discount.enabled", val)} />
              <ToggleField label="Total" enabled={config.total.enabled} onToggle={(val) => updateField("total.enabled", val)} />
            </div>
          )}
        </div>

        {/* GST Information */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <SectionHeader
            title="GST Information"
            enabled={config.gstEnabled}
            onToggle={(val) => setConfig((prev) => ({ ...prev, gstEnabled: val }))}
          />
          {config.gstEnabled && (
            <div className="p-6 grid grid-cols-3 gap-6">
              <ToggleField label="GST%" enabled={config.gstPercentInfo.enabled} onToggle={(val) => updateField("gstPercentInfo.enabled", val)} />
              <ToggleField label="Tax Amount" enabled={config.taxAmount.enabled} onToggle={(val) => updateField("taxAmount.enabled", val)} />
              <ToggleField label="CGST" enabled={config.cgst.enabled} onToggle={(val) => updateField("cgst.enabled", val)} />
              <ToggleField label="SGST" enabled={config.sgst.enabled} onToggle={(val) => updateField("sgst.enabled", val)} />
              <ToggleField label="Total GST" enabled={config.totalGst.enabled} onToggle={(val) => updateField("totalGst.enabled", val)} />
            </div>
          )}
        </div>

        {/* Payment Information */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <SectionHeader
            title="Payment Information"
            enabled={config.paymentEnabled}
            onToggle={(val) => setConfig((prev) => ({ ...prev, paymentEnabled: val }))}
          />
          {config.paymentEnabled && (
            <div className="p-6 grid grid-cols-3 gap-6">
              <ToggleField label="Amount Paid" enabled={config.amountPaid.enabled} onToggle={(val) => updateField("amountPaid.enabled", val)} />
              <ToggleField label="Payment Method" enabled={config.paymentMethod.enabled} onToggle={(val) => updateField("paymentMethod.enabled", val)} />
              <ToggleField label="Payment Status" enabled={config.paymentStatus.enabled} onToggle={(val) => updateField("paymentStatus.enabled", val)} />
              <ToggleField label="Total Discount" enabled={config.totalDiscount.enabled} onToggle={(val) => updateField("totalDiscount.enabled", val)} />
              <ToggleField label="Total Bill" enabled={config.totalBill.enabled} onToggle={(val) => updateField("totalBill.enabled", val)} />
              <ToggleField label="Outstanding Amount" enabled={config.outstandingAmount.enabled} onToggle={(val) => updateField("outstandingAmount.enabled", val)} />
            </div>
          )}
        </div>

        {/* Declaration Information */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <SectionHeader
            title="Declaration Information"
            enabled={config.declarationEnabled}
            onToggle={(val) => setConfig((prev) => ({ ...prev, declarationEnabled: val }))}
          />
          {config.declarationEnabled && (
            <div className="p-6 grid grid-cols-3 gap-6">
              <ToggleField
                label="Signature"
                enabled={config.signature.enabled}
                onToggle={(val) => updateField("signature.enabled", val)}
                showUpload
                fileName={config.signature.file?.name}
                onUpload={(file) => updateField("signature.file", file)}
              />
              <ToggleField
                label="Terms and Conditions"
                enabled={config.termsAndConditions.enabled}
                onToggle={(val) => updateField("termsAndConditions.enabled", val)}
                showInput
                inputValue={config.termsAndConditions.value}
                onInputChange={(val) => updateField("termsAndConditions.value", val)}
              />
              <ToggleField
                label="Remark"
                enabled={config.remark.enabled}
                onToggle={(val) => updateField("remark.enabled", val)}
                showInput
                inputValue={config.remark.value}
                onInputChange={(val) => updateField("remark.value", val)}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="text-primary border-primary" onClick={() => setPreviewOpen(true)}>
            Preview Bill
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>

      {/* Bill Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 bg-card">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold underline">Sales Invoice</h1>
            </div>

            <div className="flex justify-between mb-6">
              <div>
                <p><strong>Date:</strong> DD-MM-YYYY</p>
                <p><strong>Invoice No:</strong> XXXXXXXXXXXX</p>
              </div>
              <Logo />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6 border border-border p-4">
              <div className="text-sm space-y-1">
                <p>LOREM IPSUM, MAIN ROAD,</p>
                <p>IPSUM</p>
                <p>LOREMQFNKEQFQEBLF,XXXX</p>
                <p>XXXXXXXXXXX</p>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>FSSAI:</strong> ABCXXXXX</p>
                <p><strong>GSTIN:</strong> XXXXXXXXXXXX</p>
                <p><strong>DL NUMBER 1:</strong> XXXXXXXXXXXX</p>
                <p><strong>DL NUMBER 2:</strong> XXXXXXXXXXXX</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="text-sm font-medium">Patient Name</Label>
                <Input value="Lorem Ipsum" readOnly className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <Input value="Lorem Ipsum" readOnly className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-medium">Phone Number</Label>
                <Input value="+91 XXXXXXXXXX" readOnly className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-medium">Doctor Name</Label>
                <Input value="Lorem Ipsum" readOnly className="mt-1" />
              </div>
            </div>

            <table className="w-full border border-border mb-6">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-2 text-left text-sm font-semibold">ITEM</th>
                  <th className="p-2 text-left text-sm font-semibold">QUANTITY</th>
                  <th className="p-2 text-left text-sm font-semibold">HSN</th>
                  <th className="p-2 text-left text-sm font-semibold">BATCH</th>
                  <th className="p-2 text-left text-sm font-semibold">EXPIRY</th>
                  <th className="p-2 text-left text-sm font-semibold">MRP</th>
                  <th className="p-2 text-left text-sm font-semibold">GST %</th>
                  <th className="p-2 text-left text-sm font-semibold">DISCOUNT %</th>
                  <th className="p-2 text-left text-sm font-semibold">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2"><Input value="Lorem Ipsum" readOnly className="h-8" /></td>
                  <td className="p-2"><Input value="XX" readOnly className="h-8 w-16" /></td>
                  <td className="p-2"><Input value="XXXXX" readOnly className="h-8 w-20" /></td>
                  <td className="p-2"><Input value="XXXXX" readOnly className="h-8 w-20" /></td>
                  <td className="p-2"><Input value="DD-MM-YYYY" readOnly className="h-8 w-24" /></td>
                  <td className="p-2"><Input value="₹XXX" readOnly className="h-8 w-16" /></td>
                  <td className="p-2"><Input value="XX" readOnly className="h-8 w-12" /></td>
                  <td className="p-2"><Input value="XX" readOnly className="h-8 w-12" /></td>
                  <td className="p-2"><Input value="₹XXX" readOnly className="h-8 w-16" /></td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between mb-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-16 border-b border-foreground mb-2"></div>
                <p className="text-sm font-medium">Authorized Signature</p>
              </div>
              <div className="text-center">
                <p className="text-sm italic mb-4">"GET WELL SOON BY NEXUS"</p>
                <p className="text-sm font-semibold">Terms & Conditions</p>
                <p className="text-sm">Confirm Medicines from your Doctor before use</p>
              </div>
              <div className="text-right text-sm space-y-1">
                <p><strong>Amount Paid:</strong> Rs.XXX.XX</p>
                <p><strong>Total Discount:</strong> Rs.XXX.XX</p>
                <p><strong>Total Bill:</strong> Rs.XXX.XX</p>
                <p><strong>Outstanding Amt:</strong> Rs.XXX.XX</p>
                <p><strong>PAYMENT STATUS:</strong> PARTIAL PAID</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CreateBillTemplate;
