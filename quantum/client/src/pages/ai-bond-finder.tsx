import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useSEO } from "@/hooks/useSEO";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AIBondFinder() {
  useSEO({
    title: "AI Bond Finder | Quantum Surety",
    description: "Use the Quantum Surety AI assistant to identify the right bond for your project in under a minute.",
    canonical: "/ai-bond-finder",
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hey! I'm the Quantum Surety AI Assistant.\n\nTell me about your work — are you a general contractor, subcontractor, developer, or something else? I'll help you find the exact bond you need in under a minute."
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (messages: { role: string; content: string }[]) => {
      const response = await apiRequest("POST", "/api/ai/chat", { messages });
      return response.json() as Promise<{ message: string }>;
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.message
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: () => {
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again or contact support."
      };
      setMessages(prev => [...prev, fallbackMessage]);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    "I'm a general contractor",
    "I'm a subcontractor",
    "Project under $100K",
    "Project $500K - $5M",
  ];

  const handleSend = async (message?: string) => {
    const messageToSend = message || input;
    if (!messageToSend.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend
    };

    setInput("");
    
    setMessages(prev => {
      const updatedMessages = [...prev, userMessage];
      chatMutation.mutate(
        updatedMessages.map(m => ({ role: m.role, content: m.content }))
      );
      return updatedMessages;
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-gradient-to-r from-primary to-accent" data-testid="badge-ai">
            <Sparkles className="w-4 h-4 mr-1" />
            AI-Powered Bond Finder
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-ai-headline">
            Quantum AI Bond Assistant
          </h1>
          <p className="text-xl text-muted-foreground">
            Find the perfect bond for your project in under a minute
          </p>
        </div>

        <Card className="mb-6 shadow-lg">
          <div className="h-[500px] overflow-y-auto p-6 space-y-4" data-testid="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${message.role}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gradient-to-br from-indigo-50 to-teal-50 text-foreground border"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-2xl px-4 py-3 border">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 bg-card">
            <div className="flex flex-wrap gap-2 mb-4">
              {quickActions.map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend(action)}
                  disabled={chatMutation.isPending}
                  data-testid={`button-quick-${i}`}
                >
                  {action}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !chatMutation.isPending && handleSend()}
                placeholder="Type your message..."
                disabled={chatMutation.isPending}
                className="flex-1"
                data-testid="input-chat-message"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || chatMutation.isPending}
                size="icon"
                data-testid="button-send"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Ready to get your official quote?
          </p>
          <Link href="/quote">
            <Button size="lg" data-testid="button-get-quote">
              Get Your Free Quote
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
