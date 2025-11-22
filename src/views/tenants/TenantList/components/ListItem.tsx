import Card from "@/components/ui/Card";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export type ListItemData = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  address?: string | null;
};

type Props = {
  data: ListItemData;
  cardBorder?: boolean;
};

const ListItem = ({ data, cardBorder }: Props) => {
  return (
    <div className="mb-4">
      <Card bordered={cardBorder} className="p-4">
        <div className="flex justify-between items-start">
          {/* LEFT SIDE */}
          <div>
            <h6 className="font-bold text-lg">
              <Link to={`/superadmin/tenant/${data.id}`}>{data.name}</Link>
            </h6>

            <div className="text-sm text-gray-500">Slug: {data.slug}</div>

            {data.address && (
              <p className="text-sm text-gray-600 mt-1">{data.address}</p>
            )}

            {data.createdAt && (
              <p className="text-xs text-gray-400 mt-1">
                Created: {format(new Date(data.createdAt), "dd MMM yyyy")}
              </p>
            )}
          </div>

          {/* RIGHT SIDE — STATUS */}
          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                data.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {data.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ListItem;
