-- Create issue_orders table
CREATE TABLE public.issue_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  employee_type TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  remark TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create issue_order_items table
CREATE TABLE public.issue_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_order_id UUID NOT NULL REFERENCES public.issue_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  remark TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.issue_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_order_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for issue_orders
CREATE POLICY "Users can view their own issue orders" 
ON public.issue_orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own issue orders" 
ON public.issue_orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own issue orders" 
ON public.issue_orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own issue orders" 
ON public.issue_orders FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for issue_order_items
CREATE POLICY "Users can view their own issue order items" 
ON public.issue_order_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own issue order items" 
ON public.issue_order_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own issue order items" 
ON public.issue_order_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own issue order items" 
ON public.issue_order_items FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_issue_orders_updated_at
BEFORE UPDATE ON public.issue_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();