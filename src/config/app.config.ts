interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Admin'],
  customerRoles: [],
  tenantRoles: ['Admin', 'Content Manager'],
  tenantName: 'Organization',
  applicationName: 'Assignment',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
};
