import { OrganizationList } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
    return (
        <div>
            <OrganizationList
                afterSelectOrganizationUrl="/dashboard/:id"
                afterCreateOrganizationUrl="/dashboard/:id"
            />
        </div>
    );
}
