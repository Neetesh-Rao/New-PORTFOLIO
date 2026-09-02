import VintageWatch from "./components/VintageWatch";

export default function App() {
  return (
    <main className="page-shell">
      <VintageWatch />
      <img
        className="profile-photo"
        src="/images/notebook-profile.png"
        alt="A handwritten profile on a lined notebook beside a keyboard"
      />
    </main>
  );
}
