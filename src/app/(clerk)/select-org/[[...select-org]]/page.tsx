import { OrganizationList } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
    return (
        <div>
            <OrganizationList
                afterSelectOrganizationUrl="/board"
                afterCreateOrganizationUrl="/board"
            />
        </div>
    );
}
