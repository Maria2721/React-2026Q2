export default function CharacterPage({ params }: { params: { id: string } }) {
  return <div>Character {params.id}</div>;
}
