import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
export function NotFound() {
  return (
    <main className="section empty">
      <p className="eyebrow">404</p>
      <h1>
        Эта история
        <br />
        ещё не написана.
      </h1>
      <Link to="/catalog" className="button dark">
        Вернуться в коллекцию <ArrowRight size={18} />
      </Link>
    </main>
  );
}
