import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Copy, Lock, Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageInputForm } from "./MessageInputForm";
import { EncryptedMessagesList } from "./EncryptedMessagesList";
import { useNavigate } from "react-router-dom";
import ComponentHeader from "./shared/ComponentHeader";

const EncryptedMessage = () => {
  const [decryptKey, setDecryptKey] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const copyText = (text: string, type: "key" | "message") => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopyalandı",
      description: type === "key" ? "Şifre çözme anahtarı panoya kopyalandı" : "Şifreli mesaj panoya kopyalandı",
    });
  };

  const handleMessageEncrypted = (key: string, message: string) => {
    setDecryptKey(key);
    setEncryptedMessage(message);
  };

  const handleMessageDecrypted = (messageId: string) => {
    toast({
      title: "Mesaj silindi",
      description: "Görüntülenen mesaj başarıyla silindi",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <ComponentHeader
        title="Mesaj Şifreleme"
        description="Mesajlarınızı güvenli bir şekilde şifreleyin ve paylaşın. Mesajlarınız sadece şifre anahtarına sahip kişiler tarafından okunabilir."
      />

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <div className="min-w-[200px] p-3 bg-card rounded-lg border border-border/20">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-primary" />
            <span className="font-medium">1. Mesajı Girin</span>
          </div>
          <p className="text-xs text-muted-foreground">Mesajınızı yazın ve silinme seçeneğini belirleyin</p>
        </div>

        <div className="min-w-[200px] p-3 bg-card rounded-lg border border-border/20">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-primary" />
            <span className="font-medium">2. Anahtarı Paylaşın</span>
          </div>
          <p className="text-xs text-muted-foreground">Şifre çözme anahtarını güvenli bir şekilde iletin</p>
        </div>

        <div className="min-w-[200px] p-3 bg-card rounded-lg border border-border/20">
          <div className="flex items-center gap-2 mb-2">
            <Copy className="w-4 h-4 text-primary" />
            <span className="font-medium">3. Mesajı Çözün</span>
          </div>
          <p className="text-xs text-muted-foreground">Anahtarı kullanarak mesajı görüntüleyin</p>
        </div>
      </div>
      
      <MessageInputForm
        onMessageEncrypted={handleMessageEncrypted}
        onSuccess={() => {}}
      />
      
      {(decryptKey && encryptedMessage) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-4 bg-[#1a1b26] rounded-lg border border-gray-700">
            <Lock className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-2">Şifreli Mesaj:</p>
              <p className="font-mono text-white break-all">{encryptedMessage}</p>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => copyText(encryptedMessage, "message")}
              className="border-gray-700 text-white hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 p-4 bg-[#1a1b26] rounded-lg border border-gray-700">
            <Key className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-2">Şifre Çözme Anahtarı:</p>
              <p className="font-mono text-white break-all">{decryptKey}</p>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => copyText(decryptKey, "key")}
              className="border-gray-700 text-white hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <EncryptedMessagesList onMessageDecrypted={handleMessageDecrypted} messages={[]} />
    </div>
  );
};

export default EncryptedMessage;