import React, { useState } from 'react';

const Input = (props) => <input {...props} className="border p-2 w-full rounded" />;
const Button = ({ children, ...props }) => <button {...props} className="bg-blue-600 text-white px-4 py-2 rounded">{children}</button>;
const Card = ({ children, ...props }) => <div {...props} className="border rounded p-4 shadow">{children}</div>;
const CardContent = ({ children }) => <div>{children}</div>;

const API_BASE = "https://openapi.nexon.com/game/maplestorysea";

const headers = {
  'x-nxopen-api-key': 'test_bffa24a77e7bdc433481e365a07edc1771031e583ad35dc15da4317021cc44f2efe8d04e6d233bd35cf2fabdeb93fb0d'
};

export default function MapleSEAStatsTracker() {
  const [characterName, setCharacterName] = useState("");
  const [basic, setBasic] = useState(null);
  const [union, setUnion] = useState(null);
  const [dojang, setDojang] = useState(null);
  const [equip, setEquip] = useState(null);
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchEndpoint = async (endpoint, setter) => {
        const res = await fetch(`${API_BASE}${endpoint}`, { headers });
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const data = await res.json();
        setter(data);
      };

      await Promise.all([
        fetchEndpoint(`/character/basic?character_name=${characterName}`, setBasic),
        fetchEndpoint(`/character/union?character_name=${characterName}`, setUnion),
        fetchEndpoint(`/character/dojang?character_name=${characterName}`, setDojang),
        fetchEndpoint(`/character/item-equipment?character_name=${characterName}`, setEquip),
        fetchEndpoint(`/character/skill?character_name=${characterName}`, setSkill),
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">MapleStorySEA Tracker</h1>
      <div className="flex gap-2">
        <Input
          placeholder="Enter Character Name"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
        />
        <Button onClick={fetchData}>Search</Button>
      </div>

      {loading && <p className="mt-4 text-yellow-600">Loading...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}

      {basic && (
        <Card className="mt-6">
          <CardContent>
            <h2 className="text-xl font-semibold">{basic.character_name}</h2>
            <p>Level: {basic.character_level}</p>
            <p>Class: {basic.character_class}</p>
            <p>World: {basic.world_name}</p>
          </CardContent>
        </Card>
      )}

      {union && (
        <Card className="mt-6">
          <CardContent>
            <h3 className="text-lg font-semibold">Union</h3>
            <p>Union Level: {union.union_level}</p>
            <p>Union Power: {union.union_power}</p>
          </CardContent>
        </Card>
      )}

      {dojang && (
        <Card className="mt-6">
          <CardContent>
            <h3 className="text-lg font-semibold">Mu Lung Dojo</h3>
            <p>Best Floor: {dojang.dojang_best_floor}</p>
            <p>Time: {dojang.dojang_best_time}</p>
          </CardContent>
        </Card>
      )}

      {equip && (
        <Card className="mt-6">
          <CardContent>
            <h3 className="text-lg font-semibold">Equipment</h3>
            <ul className="list-disc ml-6">
              {equip.item_equipment.map((item, idx) => (
                <li key={idx}>{item.item_name} (Slot: {item.item_equipment_part})</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {skill && (
        <Card className="mt-6">
          <CardContent>
            <h3 className="text-lg font-semibold">Skills</h3>
            <ul className="list-disc ml-6">
              {skill.character_skill.map((group, i) => (
                <li key={i}>
                  <strong>{group.skill_category}</strong>
                  <ul className="ml-4">
                    {group.skill.map((s, j) => (
                      <li key={j}>{s.skill_name} Lv. {s.skill_level}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
