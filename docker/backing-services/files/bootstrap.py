import frappe
import os
from frappe.installer import make_conf, get_conf_params, make_site_dirs
from frappe.utils import get_sites


def main():
    site = 'erpnext.localhost'
    sites = get_sites()
    if len(sites):
        print('Site already exists')
        exit(0)

    site_config = get_conf_params(
        db_name='erpnext',
        db_password='erpnext'
    )

    site_config['encryption_key'] = 'l9sqa4yCapk4yawIEjbpy0uACqRSRz1z4TR2tz3aenI='

    frappe.local.site = site
    frappe.local.sites_path = os.getcwd()
    frappe.local.site_path = os.getcwd() + '/' + site
    make_conf(
        db_name=site_config.get('db_name'),
        db_password=site_config.get('db_password'),
        site_config=site_config,
    )
    make_site_dirs()
    os.system('chown -R 1000:1000 {site_path}'.format(site_path=frappe.local.site_path))


if __name__ == '__main__':
    main()
