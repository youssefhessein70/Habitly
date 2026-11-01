export default function Confirm({ text, onYes, onNo }) {
  return <div className="overlay"><div className="card modal" role="alertdialog">
    <p>{text}</p><div className="acts"><button className="danger" onClick={onYes}>Delete</button><button onClick={onNo}>Cancel</button></div>
  </div></div>;
}
