"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Loader2, CheckCircle } from "lucide-react";

interface Props {
  projectId: string;
  projectTitle: string;
}

type State = "idle" | "loading" | "success" | "error";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

export function SolicitarAcessoModal({ projectId, projectTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState("");
  const isDesktop = useIsDesktop();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          nome,
          email,
          motivo: motivo || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao enviar");
      }
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erro desconhecido");
      setState("error");
    }
  }

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v) {
      setState("idle");
      setNome("");
      setEmail("");
      setMotivo("");
      setErrorMsg("");
    }
  }

  const formContent = (
    <>
      {state === "success" ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <p className="font-medium">Solicitação enviada!</p>
          <p className="text-sm text-muted-foreground">
            Você receberá um e-mail de confirmação em breve.
          </p>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 py-2 px-4 md:px-0">
          <div className="grid gap-1.5">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Seu nome"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="motivo">Motivo (opcional)</Label>
            <Textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Por que você quer testar este projeto?"
              rows={3}
            />
          </div>
          {state === "error" && (
            <p className="text-sm text-destructive">{errorMsg}</p>
          )}
          <Button type="submit" disabled={state === "loading"}>
            {state === "loading" && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Enviar solicitação
          </Button>
        </form>
      )}
    </>
  );

  const trigger = (
    <Button size="sm" className="flex-1" onClick={() => setOpen(true)}>
      <ExternalLink className="h-4 w-4 mr-2" />
      Ver Demo
    </Button>
  );

  return (
    <>
      {trigger}

      {isDesktop ? (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900">
            <DialogHeader>
              <DialogTitle>Solicitar acesso — {projectTitle}</DialogTitle>
              <DialogDescription>
                Preencha seus dados para solicitar acesso à demo do projeto.
              </DialogDescription>
            </DialogHeader>
            {formContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetContent
            side="bottom"
            className="rounded-t-2xl pb-8 bg-white dark:bg-zinc-900"
          >
            <SheetHeader className="pb-2">
              <SheetTitle>Solicitar acesso — {projectTitle}</SheetTitle>
              <SheetDescription>
                Preencha seus dados para solicitar acesso à demo do projeto.
              </SheetDescription>
            </SheetHeader>
            {formContent}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
