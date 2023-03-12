import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";


function App() {
  const [showForm, setShowForm] = useState();
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(function () {
    async function getFacts() {
      const { data: facts, error } = await supabase.from("facts").select("*");
      setFacts(facts);
    }
    getFacts();
  }, []);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ?( 
      <Factform setFacts={setFacts} setShowForm={setShowForm} /> ): null}
      <main className="main">
      <Category setCurrentCategory={setCurrentCategory} />
      
      {isLoading ? (
        <Loader/>
      ):(
        <FactList facts={facts} setFacts={setFacts}/>
      )}
      </main>
    </>
  );
}

function Loader() {
  return <p className='message'>Loading...</p>;
}

function Header({ showForm, setShowForm }) {
  return (
    <header className="header">
      <div className="logo"></div>
      <h1 className="title">hehe website</h1>
      <button onClick={() => setShowForm((show) => !show)}>
        {showForm ? "Close" : "Share Something"}
      </button>
    </header>
  );
}

const CATEGORIES = [
  { name: "Computer Applications" },
  { name: "Architecture" },
  { name: "Languages" },
  { name: "Engineering" },
  { name: "Agriculture" },
];

function Category({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className='category'>
          <button
            className='btn btn-all-categories'
            onClick={() => setCurrentCategory('all')}
          >
            All
          </button>
        </li>

        {CATEGORIES.map((cat) => (
          <li key={cat.name} className='category'>
            <button
              className='btn btn-category'
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Factform(setFacts, setShowForm) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(e) {
    //because of it browser doesnt reload
    e.preventDefault();
    console.log(text, category);

    // chec there is data o not
    if (text && category) {
      const newFact = {
        id: Math.round(Math.random() * 3215462),
        text,
        category,
        date: new Date().getFullYear(),
      };
      setFacts((facts) => [newFact, ...facts]);
    }
  }

  return (
    <form action="#" className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="text"
        className="input form-ele"
        placeholder="Share a Fact with everyone."
        autoComplete="off"
        onChange={(e) => setText(e.target.value)}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="form-ele"
      >
        <option value="">Choose category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="form-ele">Post</button>
    </form>
  );
}

function FactList(facts, setFacts) {

  return (
    <div className="section-facts">
      <section>
        <ul className="facts">
          {facts.map((fact) => (
            <fact key={fact.id} fact={fact} setFacts={setFacts} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from('facts')
      .update({ [columnName]: fact[columnName] + 1 })
      .eq('id', fact.id)
      .select();
    setIsUpdating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  return (
    <li className='fact'>
      <p>
        {isDisputed ? <span className='disputed'>[⛔️ DISPUTED]</span> : null}
        {fact.text}
        <a className='source' href={fact.source} target='_blank'>
          (Source)
        </a>
      </p>
      <span
        className='tag'
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className='vote-buttons'>
        <button
          onClick={() => handleVote('votesInteresting')}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote('votesMindblowing')}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        
      </div>
    </li>
  );
}

export default App;
