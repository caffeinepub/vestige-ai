import Time "mo:core/Time";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Admin is Prashanth Reddy
  public shared ({ caller }) func onAdminRequest() : async () {
    if (Principal.fromText("bjbjs-rzach-2wddw-3lu2p-fb5wm-jy7ya-ytkol-3t4lj-f5pu4-amcor-dae") != caller) {
      Runtime.trap("Only Prashanth Reddy is admin");
    };
    AccessControl.assignRole(
      accessControlState,
      caller,
      caller,
      #admin,
    );
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Inquiry Type
  type Inquiry = {
    name : Text;
    phone : Text;
    problem : Text;
    timestamp : Int;
  };

  let inquiries = Map.empty<Int, Inquiry>();

  // Public function - anyone can submit inquiries (including guests/anonymous users)
  public shared ({ caller }) func submitInquiry(name : Text, phone : Text, problem : Text) : async () {
    let now = Time.now();
    let inquiry = {
      name;
      phone;
      problem;
      timestamp = now;
    };
    inquiries.add(now, inquiry);
  };

  // Admin-only function to view all inquiries
  public query ({ caller }) func getInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all inquiries");
    };
    inquiries.values().toArray();
  };
};
