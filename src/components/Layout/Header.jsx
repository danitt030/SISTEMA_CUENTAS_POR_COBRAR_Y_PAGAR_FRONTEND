import { useContext, useMemo } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut, Settings, UserRound, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getRoleName } from "../../utils/roleUtils";
import toast from "react-hot-toast";

export const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const displayName = `${user?.nombre || ""} ${user?.apellido || ""}`.trim() || "Usuario";
  const roleName = getRoleName(user?.rol);

  const avatarInitials = useMemo(() => {
    const tokens = displayName.split(" ").filter(Boolean);

    if (!tokens.length) {
      return "US";
    }

    return tokens
      .slice(0, 2)
      .map((token) => token[0]?.toUpperCase() || "")
      .join("");
  }, [displayName]);

  const handleLogout = () => {
    logout();
    toast.success("Sesion cerrada correctamente");
    navigate("/auth");
  };

  const handleMiPerfil = () => {
    navigate(`/mi-perfil/${user?.uid}`);
  };

  const handleConfiguracion = () => {
    navigate("/configuracion");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 text-white shadow-lg backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-sky-300">
            <Wallet className="h-5 w-5" />
          </span>
          <h2 className="truncate text-lg font-semibold text-slate-100 md:text-2xl">Sistema Cuentas por Cobrar y Pagar</h2>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-left transition-colors hover:border-slate-700 hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
              aria-label="Abrir menu de usuario"
            >
              <div className="hidden min-w-0 sm:flex sm:flex-col sm:items-end sm:leading-tight">
                <span className="max-w-[190px] truncate text-sm font-semibold text-slate-100">{displayName}</span>
                <span className="text-xs text-slate-400">{roleName}</span>
              </div>

              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-sm font-bold tracking-wide text-sky-200">
                {avatarInitials}
              </span>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={10}
              className="z-50 min-w-[220px] rounded-xl border border-slate-700 bg-slate-950 p-1.5 shadow-2xl"
            >
              <div className="rounded-lg px-3 py-2">
                <p className="truncate text-sm font-semibold text-slate-100">{displayName}</p>
                <p className="text-xs text-slate-400">{roleName}</p>
              </div>

              <DropdownMenu.Separator className="my-1 h-px bg-slate-800" />

              <DropdownMenu.Item
                onSelect={handleMiPerfil}
                className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors data-[highlighted]:bg-slate-800 data-[highlighted]:text-slate-100"
              >
                <UserRound className="h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onSelect={handleConfiguracion}
                className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors data-[highlighted]:bg-slate-800 data-[highlighted]:text-slate-100"
              >
                <Settings className="h-4 w-4" />
                <span>Configuracion</span>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="my-1 h-px bg-slate-800" />

              <DropdownMenu.Item
                onSelect={handleLogout}
                className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-300 outline-none transition-colors data-[highlighted]:bg-rose-500/10 data-[highlighted]:text-rose-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesion</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};
