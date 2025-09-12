'use client';

import { columns } from "./columns";
import { tags } from "./data";
import { DataTable } from "./data-table";

export default function TagsPage() {



  return (
    <section>
      <DataTable columns={columns} data={tags}/>
    </section>
  );
}
