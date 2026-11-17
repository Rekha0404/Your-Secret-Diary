const moods=['🥰','😊','🌷','😌','🥹','😔','😤','😴'];
export default function MoodSelector({ value, onChange }) { return <div className="moods">{moods.map(m=><button type="button" className={value===m?'chosen':''} key={m} onClick={()=>onChange(m)}>{m}</button>)}</div>; }
