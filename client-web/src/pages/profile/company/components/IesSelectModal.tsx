import { Button } from "@/components/ui/button";

const IesSelectModal = () => {
  const IesData = [
    {
      name: "Inatel",
    },
    {
      name: "Unifei",
    },
    {
      name: "UFF",
    },
  ];

  return (
    <div>
      <h2>Selecione o IES para publicar sua vaga</h2>
      <div>
        {IesData.map((ies) => {
          return <div className="flex justify-between" >
            <p className="text-sm lg:text-base" >{ies.name}</p>
            <Button>Publicar</Button>
          </div>;
        })}
      </div>
    </div>
  );
};

export default IesSelectModal;
