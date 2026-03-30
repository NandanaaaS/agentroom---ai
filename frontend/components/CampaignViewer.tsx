// frontend/components/CampaignViewer.tsx
import { useEffect, useState } from "react";
import { fetchCampaign } from "../utils/api";

interface FactSheet {
  product_name: string;
  features: string[];
  price: number;
  target_audience: string;
  image_url?: string;
}

interface CampaignData {
  factSheet: FactSheet;
  finalContent: string;
  logs: string[];
}

interface Props {
  content: string;
  tone: string;
}

export default function CampaignViewer({ content, tone }: Props) {
  const [data, setData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchCampaign(content, tone)
      .then(res => setData(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [content, tone]);

  if (loading) return <p>Loading campaign...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return <p>No campaign data found.</p>;

  const { factSheet, finalContent, logs } = data;

  return (
    <div className="space-y-6 p-4 border rounded shadow-lg bg-white">
      <div className="flex items-center space-x-4">
        {factSheet.image_url && (
          <img
            src={factSheet.image_url}
            alt={factSheet.product_name}
            className="w-32 h-32 object-cover rounded"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold">{factSheet.product_name}</h2>
          <p className="text-gray-700">Price: ${factSheet.price}</p>
          <p className="text-gray-700">
            Target Audience: {factSheet.target_audience}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Features:</h3>
        <ul className="list-disc ml-5 space-y-1">
          {factSheet.features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Generated Content:</h3>
        <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
          {finalContent}
        </pre>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Logs:</h3>
        <ul className="list-disc ml-5 space-y-1 text-gray-600">
          {logs.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}