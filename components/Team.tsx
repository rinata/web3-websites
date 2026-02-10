const members = [
  { name: "Avery Chen", role: "Frontend Lead", bio: "Designs playful, performant React flows.", color: "from-aqua to-electric" },
  { name: "Riley Patel", role: "Smart Contracts", bio: "Security-first solidity engineer.", color: "from-amber-300 to-orange-500" },
  { name: "Noor Kim", role: "DX & Tooling", bio: "Builds smooth CI/CD and testing pipelines.", color: "from-pink-400 to-red-400" }
];

export function Team() {
  return (
    <section id="team" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-aqua">Team</p>
        <h2 className="text-3xl font-semibold text-white">Makers behind Inata</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {members.map((member) => (
          <article key={member.name} className="glass relative overflow-hidden rounded-2xl p-6">
            <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-20`} aria-hidden />
            <div className="relative space-y-2">
              <h3 className="text-lg font-semibold text-white">{member.name}</h3>
              <p className="text-sm text-gray-300">{member.role}</p>
              <p className="text-sm text-gray-400">{member.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
