import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getAuthSession,
  subscribe,
  Task,
} from "../../session";
import { taskApi, taskApplicationApi, paymentApi, reviewApi, walletApi } from "../../../service/api";
import { ActivityIndicator } from "react-native";

export default function ClientJobDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ task?: string; taskId?: string }>();
  const initialTask = params.task ? JSON.parse(params.task as string) : null;
  const initialTaskId = params.taskId || (initialTask ? initialTask.id : null);

  const session = getAuthSession();
  const isClient = session?.role === "client";

  // Task & Applications states
  const [task, setTask] = useState<any>(initialTask);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(initialTaskId ? true : false);

  // Edit fields state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title || "");
  const [editDesc, setEditDesc] = useState(task?.description || "");
  const [editAddress, setEditAddress] = useState(task?.address || "");
  const [editPrice, setEditPrice] = useState(
    task?.price?.toString() || task?.rawBudget?.toString() || ""
  );
  const [editLat, setEditLat] = useState(
    task?.location?.coordinates ? task.location.coordinates[1]?.toString() : "10.762622"
  );
  const [editLng, setEditLng] = useState(
    task?.location?.coordinates ? task.location.coordinates[0]?.toString() : "106.660172"
  );

  // Fetch task and applications on mount / id change
  useEffect(() => {
    if (initialTaskId) {
      Promise.resolve().then(() => setIsLoading(true));
      
      // Fetch task details
      taskApi.getTaskById(initialTaskId)
        .then((res: any) => {
          setTask(res);
          setEditTitle(res.title || "");
          setEditDesc(res.description || "");
          setEditAddress(res.address || "");
          setEditPrice(res.price?.toString() || "");
          if (res.location?.coordinates) {
            setEditLng(res.location.coordinates[0]?.toString() || "106.660172");
            setEditLat(res.location.coordinates[1]?.toString() || "10.762622");
          }
        })
        .catch((err) => {
          console.error("Lỗi khi tải chi tiết công việc:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });

      // Fetch applicants
      taskApplicationApi.getApplications({ taskId: initialTaskId } as any)
        .then((res: any) => {
          setApplications(res);
        })
        .catch((err) => {
          console.error("Lỗi khi tải danh sách ứng viên:", err);
        });
    }
  }, [initialTaskId]);

  // Review fields state
  const [rating, setRating] = useState(5);
  const [selectedTaskerProfile, setSelectedTaskerProfile] = useState<any>(null);
  const [reviewComment, setReviewComment] = useState("");

  if (isLoading && !task) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center p-6">
        <ActivityIndicator size="large" color="#EA580C" />
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#EA580C" />
        <Text className="text-slate-800 font-bold text-lg mt-3">Không tìm thấy công việc</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-orange-500 px-6 py-2.5 rounded-xl"
        >
          <Text className="text-white font-bold">Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Derived state
  const isUnpaid = task.paymentStatus === "pending" || task.paymentStatus === "refunded" || !task.paymentStatus;
  const isEscrowed = task.paymentStatus === "paid";
  const isReleased = task.paymentStatus === "released";

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editAddress.trim() || !editPrice.trim()) {
      showAlert("Lỗi", "Vui lòng nhập đầy đủ: Tên công việc, địa chỉ và ngân sách.");
      return;
    }

    const priceNum = Number(editPrice.replace(/[^0-9]/g, ""));
    setIsLoading(true);
    taskApi.updateTask(task._id || task.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      address: editAddress.trim(),
      price: priceNum,
      location: {
        type: "Point",
        coordinates: [Number(editLng) || 0, Number(editLat) || 0],
      },
    })
      .then((updatedTask: any) => {
        setIsLoading(false);
        setTask(updatedTask);
        setIsEditing(false);
        showAlert("Thành công", "Đã cập nhật thông tin công việc!");
      })
      .catch((err: any) => {
        setIsLoading(false);
        showAlert("Thất bại", err.message || "Cập nhật thất bại.");
      });
  };

  const handleCancelTask = () => {
    const priceStr = typeof task.price === "number" ? task.price.toLocaleString("vi-VN") + "đ" : task.price;
    const msg = `Bạn có chắc muốn hủy công việc này không?\n\nNếu đã ký quỹ (${priceStr}), tiền sẽ được hệ thống hoàn trả lại ngay vào Ví TaskLy của bạn.`;
    if (Platform.OS === "web") {
      const confirm = window.confirm(msg);
      if (confirm) executeCancel();
    } else {
      Alert.alert("Hủy công việc", msg, [
        { text: "Không", style: "cancel" },
        { text: "Đồng ý hủy", style: "destructive", onPress: executeCancel },
      ]);
    }
  };

  const executeCancel = () => {
    setIsLoading(true);
    taskApi.cancelTask(task._id || task.id)
      .then(() => {
        setIsLoading(false);
        showAlert("Thành công", "Đã hủy công việc thành công! Tiền ký quỹ (nếu có) đã được hoàn trả lại vào Ví TaskLy của bạn.");
        router.replace("/(tabs)");
      })
      .catch((err: any) => {
        setIsLoading(false);
        showAlert("Thất bại", err.message || "Hủy công việc thất bại.");
      });
  };

  const handlePayEscrow = (method: string) => {
    showAlert("Thông báo", "Vui lòng duyệt một ứng viên bên dưới để thực hiện ký quỹ thanh toán.");
  };



  const handleReleasePayment = () => {
    setIsLoading(true);
    taskApi.completeTask(task._id || task.id)
      .then((res: any) => {
        setIsLoading(false);
        setTask(res);
        showAlert("Giải ngân", "Đã giải ngân tiền thành công cho Tasker!");
      })
      .catch((err: any) => {
        setIsLoading(false);
        showAlert("Thất bại", err.message || "Giải ngân thất bại.");
      });
  };

  const handleConfirmComplete = () => {
    setIsLoading(true);
    taskApi.completeTask(task._id || task.id)
      .then((res: any) => {
        setIsLoading(false);
        setTask(res);
        showAlert("Hoàn thành", "Công việc đã xác nhận hoàn thành! Số tiền ký quỹ tự động giải ngân cho Tasker.");
      })
      .catch((err: any) => {
        setIsLoading(false);
        showAlert("Thất bại", err.message || "Xác nhận hoàn thành thất bại.");
      });
  };

  const handleRejectApplicant = (applicationId: string, name: string) => {
    setIsLoading(true);
    taskApplicationApi.rejectApplication(applicationId)
      .then(() => {
        showAlert("Từ chối", `Đã từ chối đơn ứng tuyển của ${name}`);
        return taskApplicationApi.getApplications({ taskId: task._id || task.id } as any);
      })
      .then((res: any) => {
        setIsLoading(false);
        setApplications(res);
      })
      .catch((err: any) => {
        setIsLoading(false);
        showAlert("Thất bại", err.message || "Từ chối ứng cử viên thất bại.");
      });
  };

  const handleAcceptApplicant = (applicationId: string, name: string) => {
    if (isUnpaid) {
      router.push({
        pathname: "/(tabs)/checkout",
        params: {
          taskId: task._id || task.id,
          applicationId: applicationId,
          taskName: task.title,
          budget: task.price?.toString(),
          address: task.address,
        }
      });
      return;
    }

    setIsLoading(true);
    taskApplicationApi.acceptApplication(applicationId)
      .then(() => {
        showAlert("Thành công", `Đã chấp nhận ${name} thực hiện công việc! Các ứng viên khác tự động bị từ chối.`);
        return taskApi.getTaskById(task._id || task.id);
      })
      .then((res: any) => {
        setTask(res);
        return taskApplicationApi.getApplications({ taskId: task._id || task.id } as any);
      })
      .then((res: any) => {
        setIsLoading(false);
        setApplications(res);
      })
      .catch((err: any) => {
        setIsLoading(false);
        showAlert("Thất bại", err.message || "Duyệt ứng cử viên thất bại.");
      });
  };

  const handleSubmitReview = () => {
    if (!reviewComment.trim()) {
      showAlert("Lỗi", "Vui lòng nhập bình luận đánh giá.");
      return;
    }
    setIsLoading(true);
    reviewApi.createReview({
      taskId: task._id || task.id,
      rating,
      comment: reviewComment.trim()
    })
      .then(() => {
        setIsLoading(false);
        setReviewComment("");
        showAlert("Cảm ơn", "Đã gửi đánh giá của bạn!");
        return taskApi.getTaskById(task._id || task.id);
      })
      .then((res: any) => {
        setTask(res);
      })
      .catch((err: any) => {
        setIsLoading(false);
        showAlert("Thất bại", err.message || "Gửi đánh giá thất bại.");
      });
  };

  const showAlert = (title: string, msg: string) => {
    if (Platform.OS === "web") {
      alert(`${title}: ${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  // Get category background accent
  const getCatBg = () => {
    const name = (task.categoryId?.name || task.category || "").toLowerCase();
    if (name.includes("dọn") || name.includes("sạch")) return "bg-orange-500";
    if (name.includes("chuyển") || name.includes("giao")) return "bg-blue-500";
    if (name.includes("lắp") || name.includes("sửa")) return "bg-emerald-500";
    if (name.includes("chợ") || name.includes("mua")) return "bg-pink-500";
    return "bg-slate-500";
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header Overlay Toolbar */}
      <View
        style={{
          paddingTop: insets.top > 0 ? insets.top : 20,
          height: (insets.top > 0 ? insets.top : 20) + 48,
        }}
        className="absolute top-0 left-0 right-0 px-4 flex-row justify-between items-center z-10 bg-black/40"
      >
        <TouchableOpacity
          style={{ width: 36, height: 36 }}
          className="rounded-full bg-black/30 items-center justify-center"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-base">Chi tiết công việc</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-24">
        
        {/* Cover Image Banner */}
        <View className="relative h-44 w-full bg-slate-300">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop",
            }}
            className="w-full h-full object-cover"
          />
          <View className="absolute inset-0 bg-black/20" />
          <View className={`absolute bottom-4 left-4 ${getCatBg()} px-3 py-1 rounded-full`}>
            <Text className="color-white text-[11px] font-bold tracking-wide uppercase">
              {(task.categoryId?.name || task.category || "Công việc").toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Task Status Banner */}
        <View className="mx-4 -mt-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-row justify-between items-center">
          <View>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái công việc</Text>
            <View className="flex-row items-center mt-1 space-x-2">
              <View className={`w-2.5 h-2.5 rounded-full ${
                task.status === "completed"
                  ? "bg-green-500"
                  : task.status === "in_progress"
                  ? "bg-blue-500"
                  : task.status === "assigned"
                  ? "bg-indigo-500"
                  : task.status === "cancelled"
                  ? "bg-slate-400"
                  : "bg-orange-500"
              }`} />
              <Text className="text-sm font-bold text-slate-800">
                {task.status === "completed"
                  ? "Đã hoàn thành"
                  : task.status === "in_progress"
                  ? "Đang thực hiện"
                  : task.status === "assigned"
                  ? "Đã chấp nhận Tasker"
                  : task.status === "cancelled"
                  ? "Đã hủy bỏ"
                  : "Đang tìm kiếm (OPEN)"}
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ký quỹ (Escrow)</Text>
            <View className={`mt-1 px-2.5 py-0.5 rounded-md ${
              isReleased
                ? "bg-emerald-50 text-emerald-700"
                : isEscrowed
                ? "bg-blue-50 text-blue-700"
                : "bg-red-50 text-red-700"
            }`}>
              <Text className="text-xs font-bold">
                {isReleased ? "Đã giải ngân" : isEscrowed ? "Đang tạm giữ" : "Chưa thanh toán"}
              </Text>
            </View>
          </View>
        </View>

        {/* Edit Form or Display Card */}
        {isEditing ? (
          <View className="bg-white rounded-2xl p-5 mx-4 mt-4 shadow-sm border border-slate-100">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm font-bold text-orange-600 uppercase tracking-wider">
                Chỉnh sửa công việc
              </Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Text className="text-xs font-bold text-slate-400">Hủy</Text>
              </TouchableOpacity>
            </View>

            <View className="mb-3">
              <Text className="text-xs font-bold text-slate-600 mb-1">Tên công việc</Text>
              <TextInput
                value={editTitle}
                onChangeText={setEditTitle}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-slate-50/50"
              />
            </View>

            <View className="mb-3">
              <Text className="text-xs font-bold text-slate-600 mb-1">Mô tả công việc</Text>
              <TextInput
                value={editDesc}
                onChangeText={setEditDesc}
                multiline
                numberOfLines={3}
                style={{ textAlignVertical: "top" }}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-slate-50/50 h-16"
              />
            </View>

            <View className="mb-3">
              <Text className="text-xs font-bold text-slate-600 mb-1">Địa chỉ thực hiện</Text>
              <TextInput
                value={editAddress}
                onChangeText={setEditAddress}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-slate-50/50"
              />
            </View>

            <View className="mb-3">
              <Text className="text-xs font-bold text-slate-600 mb-1">Ngân sách (VND)</Text>
              <TextInput
                value={editPrice}
                onChangeText={setEditPrice}
                keyboardType="numeric"
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-bold bg-slate-50/50"
              />
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="w-[47%]">
                <Text className="text-[10px] font-bold text-slate-500 uppercase mb-1">Vĩ độ (Lat)</Text>
                <TextInput
                  value={editLat}
                  onChangeText={setEditLat}
                  keyboardType="numeric"
                  className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 bg-slate-50/50"
                />
              </View>
              <View className="w-[47%]">
                <Text className="text-[10px] font-bold text-slate-500 uppercase mb-1">Kinh độ (Lng)</Text>
                <TextInput
                  value={editLng}
                  onChangeText={setEditLng}
                  keyboardType="numeric"
                  className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 bg-slate-50/50"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSaveEdit}
              className="bg-orange-500 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-sm">Lưu thay đổi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white rounded-2xl p-5 mx-4 mt-4 shadow-sm border border-slate-100">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-xl font-bold text-slate-800 flex-1 leading-snug mr-3">{task.title}</Text>
              {isClient && task.status === "open" && isUnpaid && (
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="flex-row items-center border border-orange-200 bg-orange-50 px-2 py-1 rounded-lg"
                >
                  <Ionicons name="create-outline" size={14} color="#EA580C" />
                  <Text className="text-[10px] font-bold text-orange-600 ml-1">Sửa</Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row items-center space-x-1.5 mb-4">
              <Ionicons name="time-outline" size={14} color="#94A3B8" />
              <Text className="text-xs text-slate-400">{task.postedAgo || "Vừa xong"}</Text>
              <Text className="text-slate-300">•</Text>
              <Text className="text-xs font-bold text-orange-600">Đăng bởi: {task.customerId?.fullName || task.customer || "Khách hàng"}</Text>
            </View>

            {/* Bento Quick Info Details */}
            <View className="flex-row justify-between">
              <View className="w-[48%] bg-slate-50 border border-slate-100 rounded-xl p-3">
                <View className="flex-row items-center space-x-1 mb-1">
                  <Ionicons name="cash-outline" size={14} color="#EA580C" />
                  <Text className="text-[10px] font-medium text-slate-400">Ngân sách</Text>
                </View>
                <Text className="text-lg font-extrabold text-orange-600">
                  {typeof task.price === 'number' ? task.price.toLocaleString("vi-VN") + "đ" : task.price}
                </Text>
              </View>

              <View className="w-[48%] bg-slate-50 border border-slate-100 rounded-xl p-3">
                <View className="flex-row items-center space-x-1 mb-1">
                  <Ionicons name="timer-outline" size={14} color="#94A3B8" />
                  <Text className="text-[10px] font-medium text-slate-400">Thời lượng</Text>
                </View>
                <Text className="text-lg font-bold text-slate-700">{task.duration || "3 giờ"}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Description Card */}
        <View className="bg-white rounded-2xl p-5 mx-4 mt-4 shadow-sm border border-slate-100">
          <View className="flex-row items-center space-x-2 mb-3">
            <Ionicons name="document-text-outline" size={18} color="#EA580C" />
            <Text className="text-sm font-bold text-slate-800">Mô tả công việc</Text>
          </View>
          <Text className="text-sm text-slate-600 leading-relaxed mb-4">
            {task.description || "Chưa có mô tả chi tiết."}
          </Text>

          <View className="border-t border-slate-100 pt-3">
            <View className="flex-row items-center space-x-2 mb-2">
              <Ionicons name="location-outline" size={16} color="#EA580C" />
              <Text className="text-xs font-bold text-slate-700">Địa chỉ thực hiện</Text>
            </View>
            <Text className="text-xs text-slate-600 leading-relaxed mb-3">{task.address}</Text>

            {task.location?.coordinates && (
              <View className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="locate-outline" size={16} color="#475569" />
                  <Text className="text-[11px] font-semibold text-slate-700 ml-1.5">Tọa độ GPS:</Text>
                </View>
                <Text className="text-[11px] font-mono font-bold text-slate-800">
                  [{task.location.coordinates[0]}, {task.location.coordinates[1]}]
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Payments Control Section (For client user) */}
        {isClient && (
          <View className="bg-white rounded-2xl p-5 mx-4 mt-4 shadow-sm border border-slate-100">
            <Text className="text-sm font-bold text-slate-800 mb-3">Quản lý thanh toán</Text>

            {/* Unpaid payment selection simulator */}
            {isUnpaid && (
              <View>
                <Text className="text-xs text-slate-500 leading-relaxed mb-4">
                  Công việc này chưa được thanh toán ký quỹ. Vui lòng thanh toán ký quỹ để các Tasker có thể được duyệt làm việc.
                </Text>
                <View className="flex-row space-x-3 justify-between">
                  <TouchableOpacity
                    disabled={isLoading}
                    onPress={() => handlePayEscrow("MoMo")}
                    className="flex-1 bg-pink-600 py-3.5 rounded-xl flex-row items-center justify-center space-x-1.5 shadow-sm shadow-pink-600/10"
                    style={isLoading ? { opacity: 0.5 } : null}
                  >
                    <Ionicons name="wallet-outline" size={16} color="white" />
                    <Text className="text-white font-bold text-xs">Simulate MoMo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={isLoading}
                    onPress={() => handlePayEscrow("VNPAY")}
                    className="flex-1 bg-blue-600 py-3.5 rounded-xl flex-row items-center justify-center space-x-1.5 shadow-sm shadow-blue-600/10"
                    style={isLoading ? { opacity: 0.5 } : null}
                  >
                    <Ionicons name="qr-code-outline" size={16} color="white" />
                    <Text className="text-white font-bold text-xs">Simulate VNPay</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Escrowed tasker release / refund */}
            {isEscrowed && (
              <View className="mb-2">
                <Text className="text-xs text-slate-500 leading-relaxed mb-3">
                  Số tiền ký quỹ {typeof task.price === 'number' ? task.price.toLocaleString("vi-VN") + "đ" : task.price} đang được hệ thống tạm khóa an toàn. Bạn có thể giải ngân thủ công cho Tasker sau khi công việc hoàn thành.
                </Text>
                
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleReleasePayment}
                  className="w-full bg-emerald-600 py-3.5 rounded-xl flex-row items-center justify-center space-x-1.5"
                  style={isLoading ? { opacity: 0.5 } : null}
                >
                  <Ionicons name="checkmark-circle-outline" size={18} color="white" />
                  <Text className="text-white font-bold text-xs">Giải ngân cho Tasker (Release)</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Released state status */}
            {isReleased && (
              <View className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex-row items-center space-x-2.5">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <View className="flex-1">
                  <Text className="text-xs font-bold text-emerald-800">Đã hoàn tất thanh toán</Text>
                  <Text className="text-[10px] text-emerald-600 mt-0.5">Tiền ký quỹ đã được giải ngân chuyển vào ví của Tasker.</Text>
                </View>
              </View>
            )}

            {/* Cancel task when status is open or assigned */}
            {(task.status === "open" || task.status === "assigned") && (
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleCancelTask}
                className="mt-3 w-full border border-red-500 bg-red-50 py-3.5 rounded-xl flex-row items-center justify-center space-x-1.5"
                style={isLoading ? { opacity: 0.5 } : null}
              >
                <Ionicons name="close-circle-outline" size={18} color="#DC2626" />
                <Text className="text-red-700 font-bold text-xs">Hủy công việc & Hoàn tiền vào Ví</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Applications / Candidate List */}
        <View className="bg-white rounded-2xl p-5 mx-4 mt-4 shadow-sm border border-slate-100">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-bold text-slate-800">Ứng cử viên ({applications?.length || 0})</Text>
            {isUnpaid && isClient && (
              <View className="bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                <Text className="text-[9px] font-bold text-orange-600">Yêu cầu ký quỹ</Text>
              </View>
            )}
          </View>

          {(!applications || applications.length === 0) && (
            <View className="items-center py-6">
              <Ionicons name="people-outline" size={32} color="#94A3B8" />
              <Text className="text-xs text-slate-400 mt-2">Chưa có ứng cử viên nào nộp đơn.</Text>
            </View>
          )}

          {applications && applications.length > 0 && (
            <View>
              {applications.map((app) => {
                const tasker = app.taskerId || {};
                const name = tasker.fullName || "Người làm";
                const isAssigned = task.taskerId?._id === tasker._id || task.taskerId === tasker._id;
                const formattedPrice = typeof task.price === 'number' ? task.price.toLocaleString("vi-VN") + "đ" : task.price;
                return (
                  <View
                    key={app._id}
                    className={`bg-slate-50 border ${
                      isAssigned ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200"
                    } rounded-xl p-3.5 mb-3`}
                  >
                    <View className="flex-row items-center justify-between">
                      <TouchableOpacity
                        onPress={() => setSelectedTaskerProfile(tasker)}
                        className="flex-row items-center space-x-2.5"
                      >
                        <Image
                          source={{ uri: tasker.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${name}` }}
                          className="w-9 h-9 rounded-full bg-slate-200"
                        />
                        <View>
                          <Text className="text-xs font-bold text-slate-800">
                            {name} <Text className="text-[10px] text-orange-500 font-semibold">(Xem hồ sơ)</Text>
                          </Text>
                          <Text className="text-[10px] text-slate-400 mt-0.5">★ 4.9 • Tasker Chuyên Nghiệp</Text>
                        </View>
                      </TouchableOpacity>
                      {isAssigned ? (
                        <View className="bg-emerald-100 px-2 py-0.5 rounded-md">
                          <Text className="text-[9px] font-bold text-emerald-700">Đã chọn</Text>
                        </View>
                      ) : (
                        <Text className="text-xs font-bold text-slate-700">{formattedPrice}</Text>
                      )}
                    </View>

                    {/* Action buttons for Client */}
                    {isClient && task.status === "open" && (
                      <View className="flex-row space-x-2 mt-3.5 border-t border-slate-100 pt-2.5">
                        <TouchableOpacity
                          disabled={isLoading}
                          onPress={() => handleAcceptApplicant(app._id, name)}
                          className="flex-1 bg-orange-500 py-2 rounded-lg items-center flex-row justify-center space-x-1"
                          style={isLoading ? { opacity: 0.5 } : null}
                        >
                          <Ionicons name="checkmark-circle-outline" size={13} color="white" />
                          <Text className="text-white font-bold text-[11px]">Duyệt làm việc</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          disabled={isLoading}
                          onPress={() => handleRejectApplicant(app._id, name)}
                          className="bg-slate-200 px-3 py-2 rounded-lg items-center justify-center"
                          style={isLoading ? { opacity: 0.5 } : null}
                        >
                          <Text className="text-slate-600 font-bold text-[11px]">Từ chối</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* If status is assigned, display waiting for tasker start working indicator */}
          {isClient && task.status === "assigned" && (
            <View className="mt-4 w-full bg-slate-50 border border-slate-200 p-4 rounded-xl flex-row items-center justify-center space-x-2">
              <Ionicons name="hourglass-outline" size={18} color="#4F46E5" />
              <Text className="text-slate-600 font-bold text-xs">Đang chờ Tasker bắt đầu thực hiện...</Text>
            </View>
          )}

          {/* Display completion proof image from tasker if present */}
          {task.completedImage ? (
            <View className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-2xl">
              <Text className="text-sm font-extrabold text-amber-800 mb-2">📸 Hình ảnh nghiệm thu từ Tasker:</Text>
              <View style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' }}>
                <Image
                  source={{ uri: task.completedImage }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
              <Text className="text-[11px] text-amber-700 mt-2">
                * Vui lòng kiểm tra kỹ hình ảnh hoàn thành thực tế trước khi bấm &quot;Xác nhận Hoàn thành công việc&quot;.
              </Text>
            </View>
          ) : (
            isClient && task.status === "in_progress" && (
              <View className="mt-4 bg-slate-50 border border-slate-200 p-4 rounded-xl flex-row items-center justify-center space-x-2">
                <Ionicons name="images-outline" size={18} color="#EA580C" />
                <Text className="text-slate-600 font-bold text-xs">Đang chờ Tasker gửi ảnh nghiệm thu...</Text>
              </View>
            )
          )}

          {/* If status is in_progress, allow clients to complete the task */}
          {isClient && task.status === "in_progress" && (
            <TouchableOpacity
              disabled={isLoading}
              onPress={handleConfirmComplete}
              className="mt-4 w-full bg-emerald-600 py-3.5 rounded-xl flex-row items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/10"
              style={isLoading ? { opacity: 0.5 } : null}
            >
              <Ionicons name="checkmark-done-circle-outline" size={18} color="white" />
              <Text className="text-white font-extrabold text-xs">Xác nhận Hoàn thành công việc</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Confirm & Review Submission Box */}
        {(task.status === "completed" || task.status === "COMPLETED") && (
          <View className="bg-white rounded-2xl p-5 mx-4 mt-4 shadow-sm border border-slate-100">
            <Text className="text-sm font-bold text-slate-800 mb-3">Đánh giá dịch vụ</Text>

            {task.review ? (
              <View className="bg-slate-50 border border-slate-150 rounded-xl p-3.5">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-xs font-bold text-slate-700">Đánh giá của bạn:</Text>
                  <View className="flex-row space-x-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Ionicons
                        key={s}
                        name={s <= (task.review?.rating || 0) ? "star" : "star-outline"}
                        size={14}
                        color="#F59E0B"
                      />
                    ))}
                  </View>
                </View>
                <Text className="text-xs text-slate-600 italic">&quot;{task.review.comment}&quot;</Text>
              </View>
            ) : isClient ? (
              <View>
                <Text className="text-xs text-slate-500 leading-normal mb-3">
                  Hãy chấm sao và bình luận về độ hài lòng đối với Tasker sau khi hoàn thành.
                </Text>
                
                {/* Visual stars selector */}
                <View className="flex-row justify-center space-x-2.5 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                      <Ionicons
                        name={star <= rating ? "star" : "star-outline"}
                        size={28}
                        color="#F59E0B"
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Comment box */}
                <View className="border border-slate-200 rounded-xl p-2.5 mb-3 bg-slate-50/50">
                  <TextInput
                    value={reviewComment}
                    onChangeText={setReviewComment}
                    placeholder="Viết cảm nhận của bạn về chất lượng phục vụ..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={3}
                    style={{ textAlignVertical: "top" }}
                    className="text-xs text-slate-700 h-16 text-start"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSubmitReview}
                  className="bg-orange-500 py-3 rounded-xl items-center shadow-md shadow-orange-500/10"
                >
                  <Text className="text-white font-bold text-xs">Gửi đánh giá</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 items-center">
                <Text className="text-xs text-slate-500">Chờ khách hàng gửi đánh giá cho bạn.</Text>
              </View>
            )}
          </View>
        )}

        {/* Customer Info details card */}
        <View className="bg-white rounded-2xl p-5 mx-4 mt-4 shadow-sm border border-slate-100">
          <Text className="text-sm font-bold text-slate-800 mb-3.5">Thông tin khách hàng</Text>
          
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center space-x-3">
              <Image
                source={{
                  uri: task.customerId?.avatarUrl || task.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop",
                }}
                className="w-11 h-11 rounded-full bg-slate-200"
              />
              <View>
                <Text className="text-xs font-bold text-slate-800">{task.customerId?.fullName || task.customer || "Khách hàng"}</Text>
                <View className="flex-row items-center space-x-1 mt-0.5">
                  <Ionicons name="star" size={11} color="#F59E0B" />
                  <Text className="text-[10px] font-bold text-slate-600">{task.customerRating || "4.9"}</Text>
                  <Text className="text-[10px] text-slate-400">(24 reviews)</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity className="w-8 h-8 rounded-full border border-slate-200 items-center justify-center bg-slate-50">
              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#EA580C" />
            </TouchableOpacity>
          </View>

          {/* Fake map representation for GPS visual */}
          <View className="border-t border-slate-100 pt-3.5">
            <Text className="text-xs font-bold text-slate-700 mb-2">Bản đồ vị trí</Text>
            <View className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-100">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop",
                }}
                className="w-full h-full opacity-60"
              />
              <View className="absolute top-[40%] left-[45%] w-8 h-8 rounded-full bg-orange-500/25 items-center justify-center">
                <View className="w-3 h-3 rounded-full bg-orange-600 border border-white" />
              </View>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Floating Apply button for non-client (Tasker) users */}
      {!isClient && task.status === "OPEN" && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-150 p-4">
          <TouchableOpacity
            onPress={() => {
              // Simulated apply flow
              showAlert("Đơn ứng tuyển", "Ứng tuyển thành công! Vui lòng chờ khách hàng phê duyệt.");
            }}
            className="w-full bg-orange-500 py-3.5 rounded-xl items-center shadow-md shadow-orange-500/10"
          >
            <Text className="text-white font-bold text-sm">Gửi hồ sơ ứng tuyển</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal Xem thông tin Tasker */}
      <Modal visible={!!selectedTaskerProfile} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <Text className="text-base font-bold text-slate-800">Thông tin chi tiết Tasker</Text>
              <TouchableOpacity onPress={() => setSelectedTaskerProfile(null)} className="p-1 bg-slate-100 rounded-full">
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedTaskerProfile && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
                <View className="items-center mb-5">
                  <Image
                    source={{ uri: selectedTaskerProfile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${selectedTaskerProfile.fullName}` }}
                    className="w-20 h-20 rounded-full bg-slate-200 mb-3"
                  />
                  <Text className="text-lg font-bold text-slate-800 text-center">{selectedTaskerProfile.fullName || "Người làm"}</Text>
                  <Text className="text-xs text-orange-600 font-semibold mt-1">★ 4.9 • Đối tác Taskly</Text>
                </View>

                <View className="space-y-4">
                  <View className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-bold">Giới thiệu (Bio)</Text>
                    <Text className="text-xs text-slate-700 leading-normal">{selectedTaskerProfile.taskerProfile?.bio || "Chưa cung cấp giới thiệu."}</Text>
                  </View>

                  <View className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mt-3">
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-bold">Thông tin liên hệ</Text>
                    <Text className="text-xs text-slate-700 mt-1">📧 Email: {selectedTaskerProfile.email || "Đang ẩn"}</Text>
                    <Text className="text-xs text-slate-700 mt-1">📞 Số điện thoại: {selectedTaskerProfile.phone || selectedTaskerProfile.phoneNumber || "Đang ẩn"}</Text>
                  </View>

                  <View className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mt-3">
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-bold">Kỹ năng chuyên môn</Text>
                    {selectedTaskerProfile.taskerProfile?.skills && selectedTaskerProfile.taskerProfile.skills.length > 0 ? (
                      <View className="flex-row flex-wrap gap-1.5 mt-1">
                        {selectedTaskerProfile.taskerProfile.skills.map((skill: string) => (
                          <View key={skill} className="bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md">
                            <Text className="text-[10px] font-bold text-orange-600">{skill}</Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text className="text-xs text-slate-400">Chưa cập nhật kỹ năng.</Text>
                    )}
                  </View>

                  <View className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mt-3">
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-bold">Kinh nghiệm</Text>
                    <Text className="text-xs text-slate-700 leading-normal">{selectedTaskerProfile.taskerProfile?.experience || "Chưa cập nhật kinh nghiệm."}</Text>
                  </View>

                  {selectedTaskerProfile.taskerProfile?.hourlyRate > 0 && (
                    <View className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mt-3">
                      <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-bold">Mức lương mong muốn</Text>
                      <Text className="text-sm font-bold text-slate-800">{selectedTaskerProfile.taskerProfile.hourlyRate.toLocaleString("vi-VN")} VNĐ/giờ</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
