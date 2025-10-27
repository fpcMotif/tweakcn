"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function CardsReportIssue() {
  const id = React.useId();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an issue</CardTitle>
        <CardDescription>
          What area are you having problems with?
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-4 @2xl:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Label htmlFor={`area-${id}`}>Area</Label>
            <Select defaultValue="billing">
              <SelectTrigger
                aria-label="Area"
                className="w-full"
                id={`area-${id}`}
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="deployments">Deployments</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor={`security-level-${id}`}>Security Level</Label>
            <Select defaultValue="2">
              <SelectTrigger
                aria-label="Security Level"
                className="w-full [&_span]:!block [&_span]:truncate"
                id={`security-level-${id}`}
              >
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Severity 1 (Highest)</SelectItem>
                <SelectItem value="2">Severity 2</SelectItem>
                <SelectItem value="3">Severity 3</SelectItem>
                <SelectItem value="4">Severity 4 (Lowest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor={`subject-${id}`}>Subject</Label>
          <Input id={`subject-${id}`} placeholder="I need help with..." />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor={`description-${id}`}>Description</Label>
          <Textarea
            className="min-h-28"
            id={`description-${id}`}
            placeholder="Please include all information relevant to your issue."
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button size="sm" variant="ghost">
          Cancel
        </Button>
        <Button size="sm">Submit</Button>
      </CardFooter>
    </Card>
  );
}
