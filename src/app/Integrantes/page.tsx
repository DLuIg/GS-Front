import Image from 'next/image';


const teamMembers = [
  {
    name: 'Davi',
    rm: '559873',
    imageUrl: '/images/davii.jpg', 
  },
  {
    name: 'Igor',
    rm: '560088',
    imageUrl: '/images/igao.jpg',
  },
  {
    name: 'Lucas',
    rm: '561120',
    imageUrl: '/images/lucas_higuti.jpg',
  },
];


const IntegrantesPage = () => {
  return (
    <main className="bg-blue-950 min-h-screen p-8 flex flex-col items-center text-white">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Nossa <span className="text-orange-500">Equipe</span>
        </h1>
        <p className="text-center text-blue-200 mb-12 text-lg">
          Conheça os integrantes responsáveis pelo desenvolvimento do projeto.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.map((member) => (
            <div
              key={member.rm}
              className="bg-blue-900 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-orange-500/30 flex flex-col items-center text-center p-6 border-2 border-transparent hover:border-orange-500"
            >
              
              <div className="relative w-36 h-36 mb-4">
                <Image
                  src={member.imageUrl}
                  alt={`Foto de ${member.name}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full border-4 border-orange-500"
                />
              </div>

              
              <h2 className="text-2xl font-semibold text-orange-400">{member.name}</h2>
              <p className="text-blue-300 mt-1">RM: {member.rm}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default IntegrantesPage;