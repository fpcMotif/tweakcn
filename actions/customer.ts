import "server-only";

import { Customer } from "@polar-sh/sdk/models/components/customer.js";
import { polar } from "@/lib/polar";
import { logError } from "@/lib/shared";

type User = {
  id: string;
  email: string;
  name: string;
};

export const getOrCreateCustomer = async (user: User) => {
  let customer: Customer | null = null;

  try {
    customer = await polar.customers.getExternal({ externalId: user.id });
  } catch (_e) {
    customer = null;
  }

  if (customer) return customer;

  try {
    const newCustomer = await polar.customers.create({
      email: user.email,
      externalId: user.id,
      name: user.name,
    });

    return newCustomer;
  } catch (err) {
    logError(err as Error, { action: "createCustomer", user });
  }

  return null;
};
