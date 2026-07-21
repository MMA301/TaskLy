import { useRouter } from "expo-router";
import {
  Brain,
  Briefcase,
  DollarSign,
  Home,
  LogOut,
  Users as UsersIcon,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockClientsData, mockUsersData } from "../../../../mockdata";
import type { AuthSession } from "../../../session";
import { clearAuthSession } from "../../../session";

// Import our subcomponents
import { AIPerformance } from "../components/AIPerformance";
import {
  EarningsDashboard,
  TransactionItem,
} from "../components/EarningsDashboard";
import { JobAnalytics, JobItem } from "../components/JobAnalytics";
import { SystemAlert, SystemOverview } from "../components/SystemOverview";
import { UserItem, UserManagement } from "../components/UserManagement";

type AdminHomeScreenProps = {
  session: AuthSession;
};

type ActiveTab = "overview" | "jobs" | "earnings" | "ai" | "users";

export function AdminHomeScreen({ session }: AdminHomeScreenProps) {
  const router = useRouter();
  const account = session.account;
  const displayName =
    account.name || account.username || account.email || "Admin";

  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Shared State 1: Balance & Transactions
  const [balance, setBalance] = useState<number>(8450000);
  const [transactions, setTransactions] = useState<TransactionItem[]>([
    {
      id: "tx_01",
      title: "Dọn dẹp căn hộ VinHomes",
      amount: "350.000đ",
      type: "inflow",
      time: "19:22 - 20/10/2023",
      badge: "+10% Tip",
    },
    {
      id: "tx_02",
      title: "Rút tiền về Vietcombank",
      amount: "2.000.000đ",
      type: "outflow",
      time: "10:15 - 19/10/2023",
      status: "Thành công",
    },
    {
      id: "tx_03",
      title: "Giao hàng hỏa tốc (District 1)",
      amount: "120.000đ",
      type: "inflow",
      time: "18:45 - 18/10/2023",
    },
  ]);

  // Shared State 2: Alerts
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: "alert_1",
      type: "report",
      title: "Nhiệm vụ bị báo cáo",
      description:
        "Nội dung công việc #TK-9021 có dấu hiệu vi phạm quy tắc cộng đồng.",
      targetId: "#TK-9021",
    },
    {
      id: "alert_2",
      type: "verify",
      title: "Xác minh danh tính",
      description:
        "Lâm Nguyễn vừa gửi yêu cầu nâng cấp tài khoản lên Chuyên gia Dọn dẹp.",
      targetId: "Lâm Nguyễn",
    },
  ]);

  // Shared State 3: Users (Combining User & Client mockdata)
  const initialUsers: UserItem[] = [
    // Staff from user.json
    ...mockUsersData.map((u, idx) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: "0988" + (123450 + idx),
      role: u.role,
      roleLabel: "Người giúp việc",
      status: u.status === "busy" ? "busy" : "active",
      avatar:
        u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
    })),
    // Clients from client.json
    ...mockClientsData.map((c, idx) => ({
      id: c.id,
      name: c.contactName || c.companyName,
      email: c.email,
      phone: c.phone || "0912" + (234560 + idx),
      role: "client",
      roleLabel: "Khách hàng",
      status: "active",
      avatar:
        c.avatar ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${c.companyName}`,
    })),
    // Added Hoàng Yến to match mockup screenshot
    {
      id: "u_105",
      name: "Hoàng Yến",
      email: "yen.hoang@gmail.com",
      phone: "0977665544",
      role: "client",
      roleLabel: "Khách hàng",
      status: "suspended",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yen",
    },
  ];
  const [users, setUsers] = useState<UserItem[]>(initialUsers);

  // Shared State 4: Jobs/Tasks
  const [jobs] = useState<JobItem[]>([
    {
      code: "#TK-9021",
      service: "Dọn dẹp",
      serviceColor: "#8B5CF6",
      clientName: "Anh Tuấn",
      status: "Hoàn thành",
      price: "350.000đ",
    },
    {
      code: "#TK-8944",
      service: "Lắp đặt",
      serviceColor: "#3B82F6",
      clientName: "Chị Lan",
      status: "Đang thực hiện",
      price: "1.200.000đ",
    },
    {
      code: "#TK-8831",
      service: "Sửa khóa",
      serviceColor: "#D97706",
      clientName: "Minh Hoàng",
      status: "Hoàn thành",
      price: "450.000đ",
    },
  ]);

  // Callbacks
  const handleApproveAlert = (id: string) => {
    const alert = alerts.find((a) => a.id === id);
    if (alert && alert.type === "verify") {
      // Add approved user to the list
      const newU: UserItem = {
        id: "u_" + Date.now(),
        name: alert.targetId,
        email: alert.targetId.toLowerCase().replace(/\s/g, "") + "@gmail.com",
        phone: "0966" + Math.floor(100000 + Math.random() * 900000),
        role: "custom_helper",
        roleLabel: "Người giúp việc",
        status: "active",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${alert.targetId}`,
      };
      setUsers((prev) => [newU, ...prev]);
    }
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleViewTask = (taskCode: string) => {
    const job = jobs.find((j) => j.code === taskCode);
    if (job) {
      alert(
        `Chi tiết đơn hàng:\n- Mã đơn: ${job.code}\n- Dịch vụ: ${job.service}\n- Khách hàng: ${job.clientName}\n- Trạng thái: ${job.status}\n- Giá tiền: ${job.price}`,
      );
    } else {
      alert(`Đang xem chi tiết công việc: ${taskCode}`);
    }
  };

  const handleWithdraw = (amount: number, bank: string) => {
    setBalance((prev) => prev - amount);
    const newTx: TransactionItem = {
      id: "tx_" + Date.now(),
      title: `Rút tiền về ${bank}`,
      amount: `${amount.toLocaleString()}đ`,
      type: "outflow",
      time: "Vừa xong",
      status: "Thành công",
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleAddUser = (user: Omit<UserItem, "id" | "avatar">) => {
    const newU: UserItem = {
      ...user,
      id: "u_" + Date.now(),
      avatar:
        user.role === "client"
          ? `https://api.dicebear.com/7.x/identicon/svg?seed=${user.name}`
          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
    };
    setUsers((prev) => [newU, ...prev]);
  };

  const handleUpdateUserStatus = (id: string, newStatus: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
    );
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleLogout = () => {
    clearAuthSession();
    router.replace("/login");
  };

  // Render content depending on active sub-tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <SystemOverview
            alerts={alerts}
            onApproveAlert={handleApproveAlert}
            onDismissAlert={handleDismissAlert}
            onViewTask={handleViewTask}
            gvmTotal="1.250M"
            activeWorkers={users.filter((u) => u.role !== "client").length}
            totalJobs={jobs.length + 3201}
          />
        );
      case "jobs":
        return (
          <JobAnalytics
            jobs={jobs}
            onViewJobDetail={(j) => handleViewTask(j.code)}
          />
        );
      case "earnings":
        return (
          <EarningsDashboard
            balance={balance}
            transactions={transactions}
            onWithdraw={handleWithdraw}
          />
        );
      case "ai":
        return <AIPerformance />;
      case "users":
        return (
          <UserManagement
            users={users}
            onAddUser={handleAddUser}
            onUpdateStatus={handleUpdateUserStatus}
            onDeleteUser={handleDeleteUser}
          />
        );
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#F9FAFB]"
      edges={["top", "left", "right"]}
    >
      {/* Top Header */}
      <View className="px-5 pt-3 pb-3 bg-white border-b border-b-slate-100 flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center border border-purple-200">
            <Text className="text-purple-700 font-extrabold text-sm">TL</Text>
          </View>
          <View>
            <Text className="text-slate-800 text-[18px] font-extrabold tracking-wide">
              Taskly Admin
            </Text>
            <Text className="text-purple-600 text-xs font-semibold">
              Quản trị viên: {displayName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 items-center justify-center"
        >
          <LogOut size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Sub-Header / Active Tab indicator */}
      <TouchableOpacity
        onPress={() => setMenuOpen(true)}
        className="bg-white border-b border-b-slate-200/60 px-5 py-3 flex-row items-center gap-2 active:bg-slate-50"
        activeOpacity={0.8}
      >
        {activeTab === "overview" && (
          <>
            <Home size={15} color="#7C3AED" />
            <Text className="text-[14px] font-extrabold text-slate-800">
              Tổng quan
            </Text>
          </>
        )}
        {activeTab === "jobs" && (
          <>
            <Briefcase size={15} color="#7C3AED" />
            <Text className="text-[14px] font-extrabold text-slate-800">
              Công việc
            </Text>
          </>
        )}
        {activeTab === "earnings" && (
          <>
            <DollarSign size={15} color="#7C3AED" />
            <Text className="text-[14px] font-extrabold text-slate-800">
              Thu nhập
            </Text>
          </>
        )}
        {activeTab === "ai" && (
          <>
            <Brain size={15} color="#7C3AED" />
            <Text className="text-[14px] font-extrabold text-slate-800">
              Hiệu suất AI
            </Text>
          </>
        )}
        {activeTab === "users" && (
          <>
            <UsersIcon size={15} color="#7C3AED" />
            <Text className="text-[14px] font-extrabold text-slate-800">
              Người dùng
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Hamburger Navigation Modal */}
      <Modal
        visible={menuOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-slate-900/40 justify-start pt-[120px]"
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <TouchableWithoutFeedback>
            <View className="mx-5 bg-white rounded-2xl p-4 shadow-xl border border-slate-100">
              <View className="flex-row justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Danh mục quản trị
                </Text>
                <TouchableOpacity onPress={() => setMenuOpen(false)}>
                  <X size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View className="gap-1">
                {/* Overview Tab */}
                <TouchableOpacity
                  onPress={() => {
                    setActiveTab("overview");
                    setMenuOpen(false);
                  }}
                  className={`flex-row items-center gap-3 p-2.5 rounded-xl ${
                    activeTab === "overview"
                      ? "bg-purple-50"
                      : "active:bg-slate-50"
                  }`}
                >
                  <View
                    className={`w-8 h-8 rounded-lg items-center justify-center ${activeTab === "overview" ? "bg-purple-100" : "bg-slate-100"}`}
                  >
                    <Home
                      size={14}
                      color={activeTab === "overview" ? "#7C3AED" : "#64748B"}
                    />
                  </View>
                  <Text
                    className={`text-[13px] font-bold ${activeTab === "overview" ? "text-purple-700" : "text-slate-700"}`}
                  >
                    Tổng quan hệ thống
                  </Text>
                </TouchableOpacity>

                {/* Jobs Tab */}
                <TouchableOpacity
                  onPress={() => {
                    setActiveTab("jobs");
                    setMenuOpen(false);
                  }}
                  className={`flex-row items-center gap-3 p-2.5 rounded-xl ${
                    activeTab === "jobs" ? "bg-purple-50" : "active:bg-slate-50"
                  }`}
                >
                  <View
                    className={`w-8 h-8 rounded-lg items-center justify-center ${activeTab === "jobs" ? "bg-purple-100" : "bg-slate-100"}`}
                  >
                    <Briefcase
                      size={14}
                      color={activeTab === "jobs" ? "#7C3AED" : "#64748B"}
                    />
                  </View>
                  <Text
                    className={`text-[13px] font-bold ${activeTab === "jobs" ? "text-purple-700" : "text-slate-700"}`}
                  >
                    Quản lý công việc
                  </Text>
                </TouchableOpacity>

                {/* Earnings Tab */}
                <TouchableOpacity
                  onPress={() => {
                    setActiveTab("earnings");
                    setMenuOpen(false);
                  }}
                  className={`flex-row items-center gap-3 p-2.5 rounded-xl ${
                    activeTab === "earnings"
                      ? "bg-purple-50"
                      : "active:bg-slate-50"
                  }`}
                >
                  <View
                    className={`w-8 h-8 rounded-lg items-center justify-center ${activeTab === "earnings" ? "bg-purple-100" : "bg-slate-100"}`}
                  >
                    <DollarSign
                      size={14}
                      color={activeTab === "earnings" ? "#7C3AED" : "#64748B"}
                    />
                  </View>
                  <Text
                    className={`text-[13px] font-bold ${activeTab === "earnings" ? "text-purple-700" : "text-slate-700"}`}
                  >
                    Thu nhập & Tài chính
                  </Text>
                </TouchableOpacity>

                {/* AI Performance Tab */}
                <TouchableOpacity
                  onPress={() => {
                    setActiveTab("ai");
                    setMenuOpen(false);
                  }}
                  className={`flex-row items-center gap-3 p-2.5 rounded-xl ${
                    activeTab === "ai" ? "bg-purple-50" : "active:bg-slate-50"
                  }`}
                >
                  <View
                    className={`w-8 h-8 rounded-lg items-center justify-center ${activeTab === "ai" ? "bg-purple-100" : "bg-slate-100"}`}
                  >
                    <Brain
                      size={14}
                      color={activeTab === "ai" ? "#7C3AED" : "#64748B"}
                    />
                  </View>
                  <Text
                    className={`text-[13px] font-bold ${activeTab === "ai" ? "text-purple-700" : "text-slate-700"}`}
                  >
                    Hiệu suất trợ lý AI
                  </Text>
                </TouchableOpacity>

                {/* Users Tab */}
                <TouchableOpacity
                  onPress={() => {
                    setActiveTab("users");
                    setMenuOpen(false);
                  }}
                  className={`flex-row items-center gap-3 p-2.5 rounded-xl ${
                    activeTab === "users"
                      ? "bg-purple-50"
                      : "active:bg-slate-50"
                  }`}
                >
                  <View
                    className={`w-8 h-8 rounded-lg items-center justify-center ${activeTab === "users" ? "bg-purple-100" : "bg-slate-100"}`}
                  >
                    <UsersIcon
                      size={14}
                      color={activeTab === "users" ? "#7C3AED" : "#64748B"}
                    />
                  </View>
                  <Text
                    className={`text-[13px] font-bold ${activeTab === "users" ? "text-purple-700" : "text-slate-700"}`}
                  >
                    Quản lý người dùng
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* Main View Area */}
      <View className="flex-1 px-4 pt-4">{renderTabContent()}</View>
    </SafeAreaView>
  );
}
