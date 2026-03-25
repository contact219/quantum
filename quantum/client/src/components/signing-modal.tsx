import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, AlertCircle } from "lucide-react";

interface SigningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  companyName: string;
}

export function SigningModal({
  open,
  onOpenChange,
  quoteId,
  companyName,
}: SigningModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const signMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/applications/${quoteId}/sign/complete`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to complete signing");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Agreement signed successfully! Your application has been submitted for final approval.",
      });
      // Invalidate quotes to refresh status
      queryClient.invalidateQueries({ queryKey: ["/api/user/quotes"] });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to sign agreement. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSign = async () => {
    if (!agreeToTerms) {
      toast({
        title: "Please agree",
        description: "You must agree to the terms before signing.",
        variant: "destructive",
      });
      return;
    }
    signMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Review & Sign Agreement
          </DialogTitle>
          <DialogDescription>
            Please review and sign the bond agreement for {companyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Agreement Preview</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This is a production-ready bond agreement template. In a live system, this would display the full DocuSign/PandaDoc signing interface. For now, you can review the key terms below:
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-sm">
                <p className="font-medium">Bond Type:</p>
                <p className="text-muted-foreground">Performance Bond</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Company:</p>
                <p className="text-muted-foreground">{companyName}</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Terms:</p>
                <p className="text-muted-foreground">
                  You agree to maintain bond coverage as required by the obligee and comply with all surety terms and conditions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="agree"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              data-testid="checkbox-agree-terms"
            />
            <Label
              htmlFor="agree"
              className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and conditions of this bond agreement
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-signing"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSign}
            disabled={!agreeToTerms || signMutation.isPending}
            data-testid="button-sign-agreement"
          >
            {signMutation.isPending ? "Signing..." : "Sign Agreement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
