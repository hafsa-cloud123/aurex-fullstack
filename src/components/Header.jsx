import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <h1>AUREX Tasks</h1>
      <div className="header-right">
        <span className="muted">{user?.name}</span>
        <button className="btn btn-ghost" onClick={logout}>Log out</button>
      </div>
    </header>
  );
}
