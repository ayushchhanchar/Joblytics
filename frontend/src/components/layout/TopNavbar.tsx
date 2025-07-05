import  { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ModeToggle } from "../ui/mode-toggle";
import { NotificationPanel } from "./NotificationPanel";
import { Menu, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface TopNavbarProps {
  onMenuClick: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://joblytics.notdeveloper.in/api/userdetails",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        console.log("User details:", response.data.user.avatarUrl);
        setUser(response.data.user);
      } catch (err: any) {
        console.error(
          "Error fetching user details:",
          err.response?.data || err.message
        );
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side - Mobile menu button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notifications */}
          <NotificationPanel />

          {/* Theme toggle */}
          <ModeToggle />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  {user?.avatarUrl ? (
                    <>
                      <AvatarImage
                        src={user.avatarUrl}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className="text-sm">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="text-sm">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
